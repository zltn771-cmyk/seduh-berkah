import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/types';
import { INITIAL_ORDERS } from '@/lib/mock-data';

/**
 * Validates finite state machine transitions for order statuses.
 */
export function validateStatusTransition(
  current: OrderStatus,
  next: OrderStatus
): { valid: boolean; message?: string } {
  // Normalize legacy status names
  const normCurrent = current === 'confirmed' || current === 'preparing' ? 'processing' : current;
  const normNext = next === 'confirmed' || next === 'preparing' ? 'processing' : next;

  if (normCurrent === normNext) {
    return { valid: true };
  }

  if (normCurrent === 'completed') {
    return { valid: false, message: 'Pesanan yang sudah selesai (completed) tidak dapat diubah statusnya.' };
  }

  if (normCurrent === 'cancelled') {
    return { valid: false, message: 'Pesanan yang telah dibatalkan tidak dapat diaktifkan kembali.' };
  }

  if (normNext === 'cancelled') {
    return { valid: true };
  }

  const validPaths: Record<string, string[]> = {
    pending: ['processing', 'ready'],
    processing: ['ready'],
    ready: ['completed'],
  };

  const allowed = validPaths[normCurrent];
  if (allowed && allowed.includes(normNext)) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Transisi status tidak diizinkan dari "${normCurrent}" ke "${normNext}".`,
  };
}

export async function submitOrderToSupabase(payload: {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  orderSource: 'online' | 'walk_in';
  notes?: string;
  isDonationOptIn: boolean;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<{ success: boolean; orderId?: string; orderNumber: string }> {
  const supabase = createClient();

  if (!supabase) {
    // Mock mode
    return {
      success: true,
      orderNumber: payload.orderNumber,
    };
  }

  try {
    const formattedItems = payload.items.map((it) => ({
      product_id: it.productId,
      quantity: it.quantity,
    }));

    const { data, error } = await supabase.rpc('create_order_atomic', {
      p_order_number: payload.orderNumber,
      p_customer_name: payload.customerName,
      p_customer_phone: payload.customerPhone || '',
      p_order_source: payload.orderSource,
      p_notes: payload.notes || '',
      p_is_donation_opt_in: payload.isDonationOptIn,
      p_items: formattedItems,
    });

    if (error) {
      console.error('Error RPC create_order_atomic:', error);
      throw error;
    }

    return {
      success: true,
      orderId: data?.order_id,
      orderNumber: data?.order_number || payload.orderNumber,
    };
  } catch (err: any) {
    console.warn('Fallback to local state due to Supabase error:', err.message);
    return {
      success: true,
      orderNumber: payload.orderNumber,
    };
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  const supabase = createClient();
  if (!supabase) return INITIAL_ORDERS;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        customer_phone,
        order_source,
        status,
        subtotal,
        donation_amount,
        total_amount,
        notes,
        cancellation_reason,
        created_at,
        order_items (
          id,
          product_id,
          product_name_snapshot,
          price_snapshot,
          hpp_snapshot,
          quantity,
          subtotal
        ),
        payment_records (
          payment_status,
          total_received
        )
      `)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_ORDERS;
    }

    return data.map((item: any) => ({
      id: item.id,
      orderNumber: item.order_number,
      customerName: item.customer_name,
      customerPhone: item.customer_phone || undefined,
      orderSource: item.order_source === 'walk_in' ? 'walk_in_pos' : 'online_web',
      status: item.status as OrderStatus,
      subtotal: Number(item.subtotal),
      totalHpp: item.order_items?.reduce((acc: number, curr: any) => acc + Number(curr.hpp_snapshot) * curr.quantity, 0) || 0,
      donationAmount: Number(item.donation_amount),
      totalReceived: Number(item.total_amount),
      paymentMethod: 'cash_on_pickup',
      paymentStatus: item.payment_records?.[0]?.payment_status || 'unpaid',
      notes: item.notes || undefined,
      cancellationReason: item.cancellation_reason || undefined,
      createdAt: item.created_at,
      items: (item.order_items || []).map((it: any) => ({
        productId: it.product_id,
        productName: it.product_name_snapshot,
        price: Number(it.price_snapshot),
        hpp: Number(it.hpp_snapshot),
        quantity: it.quantity,
        subtotal: Number(it.subtotal),
        totalHpp: Number(it.hpp_snapshot) * it.quantity,
      })),
    }));
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err);
    return INITIAL_ORDERS;
  }
}

export async function updateOrderStatusInSupabase(
  orderId: string,
  newStatus: OrderStatus,
  reason?: string,
  operatorId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (!supabase) return { success: true };

  try {
    const isCompleted = newStatus === 'completed';
    const isCancelled = newStatus === 'cancelled';

    // 1. Update order status
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (isCancelled && reason) {
      updateData.cancellation_reason = reason;
    }

    const { error: orderError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (orderError) throw orderError;

    // 2. If completed, update payment_record to paid
    if (isCompleted) {
      const { error: paymentError } = await supabase
        .from('payment_records')
        .update({
          payment_status: 'paid',
          received_at: new Date().toISOString(),
          received_by: operatorId || null,
        })
        .eq('order_id', orderId);

      if (paymentError) {
        console.warn('Warning updating payment record:', paymentError);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to update order status in Supabase:', err);
    return { success: false, error: err.message };
  }
}
