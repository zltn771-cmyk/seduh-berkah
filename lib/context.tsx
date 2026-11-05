'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Product,
  CartItem,
  Order,
  OrderStatus,
  OperationalCost,
  MudharabahSetting,
  NisbahHistory,
  FinancialReport,
  DonationDistribution,
  EvidenceStatus,
  AuditLog,
} from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_OPERATIONAL_COSTS,
  INITIAL_MUDHARABAH_SETTING,
  INITIAL_FINANCIAL_REPORT,
  INITIAL_DONATION_DISTRIBUTIONS,
} from './mock-data';
import { fetchProducts } from '@/services/product.service';
import {
  fetchOrdersFromSupabase,
  submitOrderToSupabase,
  updateOrderStatusInSupabase,
  validateStatusTransition,
} from '@/services/order.service';
import { fetchCurrentProfile, signOutUser, UserProfile } from '@/services/auth.service';
import {
  calculateFinancials,
  getDateRange,
  PeriodFilter,
  DateRange,
} from '@/services/financial.service';
import { calculateDonationSummary, DonationSummary } from '@/services/donation.service';

interface AppContextType {
  // Auth & Role
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  logout: () => Promise<void>;
  isSupabaseConnected: boolean;

  // Products
  products: Product[];
  toggleProductAvailability: (id: string) => void;
  updateProductPrice: (id: string, price: number) => void;
  updateProductDetails: (id: string, updates: Partial<Product>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isDonationOptIn: boolean;
  setIsDonationOptIn: (optIn: boolean) => void;
  totalPortionsInCart: number;
  subtotalInCart: number;
  donationInCart: number;
  totalPaymentInCart: number;

  // Orders
  orders: Order[];
  myOrderNumbers: string[];
  createOrder: (payload: {
    customerName: string;
    customerPhone?: string;
    notes?: string;
    orderSource?: 'online_web' | 'walk_in_pos' | 'online' | 'walk_in';
  }) => Order;
  createWalkinOrder: (payload: {
    customerName: string;
    items: Array<{ productId: string; quantity: number }>;
    isDonationOptIn: boolean;
    notes?: string;
    isPaidImmediately?: boolean;
  }) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    reason?: string
  ) => { success: boolean; message?: string };
  recordOrderPayment: (
    orderId: string,
    operatorName?: string
  ) => { success: boolean; message?: string };

  // Operational Costs
  operationalCosts: OperationalCost[];
  addOperationalCost: (payload: Omit<OperationalCost, 'id'>) => void;

  // Mudharabah & Nisbah
  mudharabahSetting: MudharabahSetting;
  nisbahHistory: NisbahHistory[];
  updateNisbah: (shahibulMaalRatio: number, mudharibRatio: number, reason: string) => boolean;

  // Financial Reporting & Verifications
  periodFilter: PeriodFilter;
  setPeriodFilter: (filter: PeriodFilter) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  currentDynamicReport: FinancialReport;
  verifiedReports: FinancialReport[];
  publishedReport: FinancialReport | null;
  togglePublishReport: (reportId: string) => void;
  submitCurrentReport: () => void;
  verifyCurrentReport: (verifierName: string) => void;
  rejectCurrentReport: (notes: string) => void;
  financialReport: FinancialReport;
  submitFinancialReport: () => void;
  verifyFinancialReport: (verifierName?: string) => void;
  rejectFinancialReport: (notes?: string) => void;

  // Sedekah Distributions
  donationDistributions: DonationDistribution[];
  donationSummary: DonationSummary;
  updateEvidenceStatus: (
    distributionId: string,
    evidenceId: string,
    newStatus: EvidenceStatus,
    verifierName?: string,
    rejectionReason?: string
  ) => void;
  addDonationDistribution: (payload: {
    title: string;
    description: string;
    targetInstitution: string;
    totalAmount: number;
    evidenceUrl?: string;
  }) => { success: boolean; message?: string };

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string, before?: any, after?: any) => void;

  // Real-time KPI Stats
  stats: {
    totalRevenue: number;
    totalHpp: number;
    grossProfit: number;
    totalCosts: number;
    paidCosts: number;
    unpaidCosts: number;
    currentNetProfit: number;
    takmirShare: number;
    operatorShare: number;
    totalBusinessCash: number;
    totalSedekahCollected: number;
    totalSedekahDisbursed: number;
    sedekahBalance: number;
    totalRecordedFunds: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDonationOptIn, setIsDonationOptIn] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [myOrderNumbers, setMyOrderNumbers] = useState<string[]>([]);
  const [operationalCosts, setOperationalCosts] = useState<OperationalCost[]>(INITIAL_OPERATIONAL_COSTS);
  const [mudharabahSetting, setMudharabahSetting] = useState<MudharabahSetting>(INITIAL_MUDHARABAH_SETTING);
  const [donationDistributions, setDonationDistributions] = useState<DonationDistribution[]>(INITIAL_DONATION_DISTRIBUTIONS);

  // Period Filter State
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-11-30');

  // Nisbah History State
  const [nisbahHistory, setNisbahHistory] = useState<NisbahHistory[]>([
    {
      id: 'nisbah-init',
      timestamp: '2026-11-01 08:00:00',
      changedBy: 'Takmir Masjid Kampus (H. Abdullah)',
      oldShahibulMaalRatio: 60,
      oldMudharibRatio: 40,
      newShahibulMaalRatio: 60,
      newMudharibRatio: 40,
      reason: 'Penetapan nisbah awal 60:40 sesuai naskah kesepakatan pendirian kedai.',
    },
  ]);

  // Financial Reports State
  const [verifiedReports, setVerifiedReports] = useState<FinancialReport[]>([
    {
      ...INITIAL_FINANCIAL_REPORT,
      id: 'rep-oct-2026',
      periodLabel: 'Bulan Oktober 2026',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-31',
      totalTransactions: 1200,
      totalItemsSold: 1200,
      productHppBreakdown: [
        { name: 'Kopi Hitam Robusta', quantity: 200, unitHpp: 2500, totalHpp: 500000 },
        { name: 'Es Kopi Susu Gula Aren', quantity: 400, unitHpp: 5500, totalHpp: 2200000 },
        { name: 'Es Americano', quantity: 200, unitHpp: 3100, totalHpp: 620000 },
        { name: 'Latte Hangat', quantity: 150, unitHpp: 4800, totalHpp: 720000 },
        { name: 'Es Cokelat Signature', quantity: 150, unitHpp: 4000, totalHpp: 600000 },
        { name: 'Lemon Tea Dingin', quantity: 100, unitHpp: 3500, totalHpp: 350000 },
      ],
      totalOperationalCost: 4060000,
      nisbahTakmir: 60,
      nisbahOperator: 40,
      isLoss: false,
      completedCount: 1200,
      cancelledCount: 0,
      pendingCount: 0,
      verifiedBy: 'Ketua Dewan Takmir (Dr. Ir. H. Syamsul)',
    },
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'audit-1',
      timestamp: '2026-11-01 09:30:00',
      userId: 'usr-takmir-1',
      userRole: 'takmir',
      action: 'VERIFY_FINANCIAL_REPORT',
      details: 'Pengesahan dan penguncian laporan keuangan periode Oktober 2026 (Laba Bersih Rp3.062.000).',
    },
    {
      id: 'audit-2',
      timestamp: '2026-10-31 16:30:00',
      userId: 'usr-takmir-1',
      userRole: 'takmir',
      action: 'VERIFY_DONATION_EVIDENCE',
      details: 'Verifikasi tanda terima penyaluran sedekah Rp600.000 kepada mitra lembaga amil zakat.',
    },
  ]);

  const addAuditLog = (action: string, details: string, before?: any, after?: any) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      userId: currentUser?.id || activeRole,
      userRole: activeRole,
      action,
      details,
      beforeData: before,
      afterData: after,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Initial Load & Auth
  useEffect(() => {
    const savedRole = localStorage.getItem('sb_role');
    if (savedRole && ['customer', 'operator', 'takmir'].includes(savedRole)) {
      setActiveRole(savedRole as UserRole);
    }

    const savedOrders = localStorage.getItem('sb_my_orders');
    if (savedOrders) {
      try {
        setMyOrderNumbers(JSON.parse(savedOrders));
      } catch {}
    }

    const hasSupabase = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    setIsSupabaseConnected(hasSupabase);

    fetchProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });

    fetchOrdersFromSupabase().then((data) => {
      if (data && data.length > 0) setOrders(data);
    });

    fetchCurrentProfile().then((profile) => {
      if (profile) {
        setCurrentUser(profile);
        setActiveRole(profile.role);
      }
    });
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_role', role);
    }
  };

  const logout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setActiveRole('customer');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_role');
    }
  };

  // Products
  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const updateProductPrice = (id: string, price: number) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item))
    );
  };

  const updateProductDetails = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addAuditLog('UPDATE_PRODUCT', `Pembaruan data produk ID ${id}`, undefined, updates);
  };

  // Cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setIsDonationOptIn(false);
  };

  const totalPortionsInCart = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalInCart = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const donationInCart = isDonationOptIn ? totalPortionsInCart * 1000 : 0;
  const totalPaymentInCart = subtotalInCart + donationInCart;

  const saveMyOrderNumber = (orderNum: string) => {
    setMyOrderNumbers((prev) => {
      const updated = [orderNum, ...prev.filter((o) => o !== orderNum)];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sb_my_orders', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Create Order
  const createOrder = (payload: {
    customerName: string;
    customerPhone?: string;
    notes?: string;
    orderSource?: 'online_web' | 'walk_in_pos' | 'online' | 'walk_in';
  }) => {
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SB-${dateStr}-${randomSuffix}`;

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      hpp: item.product.hpp,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      totalHpp: item.product.hpp * item.quantity,
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    const totalHpp = orderItems.reduce((acc, item) => acc + item.totalHpp, 0);
    const donationAmount = isDonationOptIn ? totalPortionsInCart * 1000 : 0;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: payload.customerName.trim() || 'Pelanggan Kedai',
      customerPhone: payload.customerPhone?.trim() || '',
      orderSource: payload.orderSource === 'walk_in_pos' || payload.orderSource === 'walk_in' ? 'walk_in_pos' : 'online_web',
      status: 'pending',
      items: orderItems,
      subtotal,
      totalHpp,
      donationAmount,
      totalReceived: subtotal + donationAmount,
      paymentMethod: 'cash_on_pickup',
      paymentStatus: 'unpaid',
      notes: payload.notes || '',
      createdAt: timestamp.toISOString(),
    };

    saveMyMyOrderNumber: saveMyOrderNumber(orderNumber);

    submitOrderToSupabase({
      orderNumber,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      orderSource: 'online',
      notes: payload.notes,
      isDonationOptIn,
      items: cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
    }).catch((err) => console.warn('Supabase order submit error:', err));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Walk-in POS
  const createWalkinOrder = (payload: {
    customerName: string;
    items: Array<{ productId: string; quantity: number }>;
    isDonationOptIn: boolean;
    notes?: string;
    isPaidImmediately?: boolean;
  }) => {
    const timestamp = new Date();
    const dateStr = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SB-POS-${dateStr}-${randomSuffix}`;

    const orderItems = payload.items.map((it) => {
      const prod = products.find((p) => p.id === it.productId) || products[0];
      return {
        productId: prod.id,
        productName: prod.name,
        price: prod.price,
        hpp: prod.hpp,
        quantity: it.quantity,
        subtotal: prod.price * it.quantity,
        totalHpp: prod.hpp * it.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    const totalHpp = orderItems.reduce((acc, item) => acc + item.totalHpp, 0);
    const totalPortions = orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const donationAmount = payload.isDonationOptIn ? totalPortions * 1000 : 0;
    const isPaid = Boolean(payload.isPaidImmediately);

    const newOrder: Order = {
      id: `ord-pos-${Date.now()}`,
      orderNumber,
      customerName: payload.customerName.trim() || 'Pelanggan Langsung (Walk-in)',
      orderSource: 'walk_in_pos',
      status: isPaid ? 'completed' : 'processing',
      items: orderItems,
      subtotal,
      totalHpp,
      donationAmount,
      totalReceived: subtotal + donationAmount,
      paymentMethod: 'cash_on_pickup',
      paymentStatus: isPaid ? 'paid' : 'unpaid',
      notes: payload.notes || 'Pemesanan langsung di meja kasir kedai',
      createdAt: timestamp.toISOString(),
      completedAt: isPaid ? timestamp.toISOString() : undefined,
    };

    submitOrderToSupabase({
      orderNumber,
      customerName: newOrder.customerName,
      customerPhone: '',
      orderSource: 'walk_in',
      notes: newOrder.notes,
      isDonationOptIn: payload.isDonationOptIn,
      items: payload.items,
    }).catch((err) => console.warn('Supabase walkin fallback:', err));

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Status Update
  const updateOrderStatus = (
    orderId: string,
    nextStatus: OrderStatus,
    reason?: string
  ): { success: boolean; message?: string } => {
    const existing = orders.find((o) => o.id === orderId);
    if (!existing) {
      return { success: false, message: 'Pesanan tidak ditemukan.' };
    }

    const check = validateStatusTransition(existing.status, nextStatus);
    if (!check.valid) {
      return { success: false, message: check.message };
    }

    const isCompleting = nextStatus === 'completed';

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: nextStatus,
            cancellationReason: reason || order.cancellationReason,
            paymentStatus: isCompleting ? 'paid' : order.paymentStatus,
            completedAt: isCompleting ? new Date().toISOString() : order.completedAt,
          };
        }
        return order;
      })
    );

    updateOrderStatusInSupabase(
      orderId,
      nextStatus,
      reason,
      currentUser?.id || 'operator-session'
    );

    addAuditLog(
      'UPDATE_ORDER_STATUS',
      `Pesanan ${existing.orderNumber} diubah dari ${existing.status} ke ${nextStatus}${reason ? ` (Alasan: ${reason})` : ''}`,
      { status: existing.status },
      { status: nextStatus }
    );

    return { success: true };
  };

  // Payment Recording
  const recordOrderPayment = (
    orderId: string,
    operatorName = 'Kasir Kedai'
  ): { success: boolean; message?: string } => {
    const existing = orders.find((o) => o.id === orderId);
    if (!existing) {
      return { success: false, message: 'Pesanan tidak ditemukan.' };
    }

    if (existing.paymentStatus === 'paid') {
      return { success: false, message: 'Pembayaran pesanan ini sudah tercatat sebelumnya (Paid).' };
    }

    if (existing.totalReceived !== existing.subtotal + existing.donationAmount) {
      return {
        success: false,
        message: 'Validasi rekonsiliasi gagal: total_received harus sama dengan subtotal + donasi.',
      };
    }

    const completedAt = new Date().toISOString();

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'completed',
            paymentStatus: 'paid',
            completedAt,
          };
        }
        return order;
      })
    );

    updateOrderStatusInSupabase(
      orderId,
      'completed',
      undefined,
      currentUser?.id || operatorName
    );

    addAuditLog(
      'RECORD_PAYMENT',
      `Pembayaran diterima untuk pesanan ${existing.orderNumber}. Penjualan: ${existing.subtotal}, Sedekah: ${existing.donationAmount}, Total: ${existing.totalReceived}`,
      { paymentStatus: 'unpaid' },
      { paymentStatus: 'paid' }
    );

    return { success: true };
  };

  // Operational costs
  const addOperationalCost = (payload: Omit<OperationalCost, 'id'>) => {
    const newCost: OperationalCost = {
      ...payload,
      id: `cost-${Date.now()}`,
    };
    setOperationalCosts((prev) => [newCost, ...prev]);
    addAuditLog(
      'RECORD_OPERATIONAL_COST',
      `Pencatatan biaya "${payload.description}" sebesar Rp${payload.amount.toLocaleString('id-ID')} (${payload.costType}, status: ${payload.paymentStatus})`
    );
  };

  // Mudharabah & Nisbah Management
  const updateNisbah = (shahibulMaalRatio: number, mudharibRatio: number, reason: string): boolean => {
    if (shahibulMaalRatio + mudharibRatio !== 100) {
      return false;
    }

    const oldSetting = { ...mudharabahSetting };
    const newSetting = {
      shahibulMaalRatio,
      mudharibRatio,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      changeReason: reason,
    };

    setMudharabahSetting(newSetting);

    const historyEntry: NisbahHistory = {
      id: `nisbah-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      changedBy: currentUser?.fullName || 'Takmir Masjid Kampus',
      oldShahibulMaalRatio: oldSetting.shahibulMaalRatio,
      oldMudharibRatio: oldSetting.mudharibRatio,
      newShahibulMaalRatio: shahibulMaalRatio,
      newMudharibRatio: mudharibRatio,
      reason,
    };

    setNisbahHistory((prev) => [historyEntry, ...prev]);

    addAuditLog(
      'UPDATE_NISBAH',
      `Perubahan nisbah bagi hasil menjadi ${shahibulMaalRatio}% Takmir : ${mudharibRatio}% Pengelola. Alasan: ${reason}`,
      oldSetting,
      newSetting
    );

    return true;
  };

  // DYNAMIC FINANCIAL ENGINE
  const selectedDateRange: DateRange = getDateRange(periodFilter, customStartDate, customEndDate);
  const currentDynamicReport: FinancialReport = calculateFinancials(
    orders,
    operationalCosts,
    mudharabahSetting,
    selectedDateRange
  );

  // Financial Report Workflow
  const submitCurrentReport = () => {
    currentDynamicReport.status = 'submitted_by_operator';
    currentDynamicReport.submittedAt = new Date().toISOString();
    currentDynamicReport.submittedBy = currentUser?.fullName || 'Operator Kedai (Mudharib)';

    addAuditLog(
      'SUBMIT_FINANCIAL_REPORT',
      `Pengajuan draf laporan keuangan periode ${currentDynamicReport.periodLabel} kepada Takmir.`
    );
  };

  const verifyCurrentReport = (verifierName: string) => {
    const verifiedReport: FinancialReport = {
      ...currentDynamicReport,
      id: `rep-locked-${Date.now()}`,
      status: 'verified_by_takmir',
      verifiedAt: new Date().toISOString(),
      verifiedBy: verifierName,
    };

    setVerifiedReports((prev) => [verifiedReport, ...prev]);

    addAuditLog(
      'VERIFY_FINANCIAL_REPORT',
      `Pengesahan & penguncian resmi laporan keuangan periode ${verifiedReport.periodLabel} oleh ${verifierName}. Laba Bersih: Rp${verifiedReport.netProfit.toLocaleString('id-ID')}`
    );
  };

  const rejectCurrentReport = (notes: string) => {
    currentDynamicReport.status = 'rejected';
    currentDynamicReport.rejectionNotes = notes;

    addAuditLog(
      'REJECT_FINANCIAL_REPORT',
      `Penolakan draf laporan keuangan periode ${currentDynamicReport.periodLabel}. Catatan revisi: ${notes}`
    );
  };

  const togglePublishReport = (reportId: string) => {
    setVerifiedReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const nextState = !r.isPublishedToPublic;
          return {
            ...r,
            isPublishedToPublic: nextState,
            publishedAt: nextState ? new Date().toISOString() : undefined,
            publishedBy: nextState ? currentUser?.fullName || 'Takmir Masjid Kampus UNIB' : undefined,
          };
        }
        return r;
      })
    );

    addAuditLog(
      'PUBLISH_FINANCIAL_REPORT',
      `Status publikasi laporan ID ${reportId} diubah oleh ${currentUser?.fullName || 'Takmir'}.`
    );
  };

  const publishedReport = verifiedReports.find((r) => r.isPublishedToPublic) || verifiedReports[0] || null;

  // SEDEKAH MANAGEMENT
  const donationSummary = calculateDonationSummary(orders, donationDistributions);

  const addDonationDistribution = (payload: {
    title: string;
    description: string;
    targetInstitution: string;
    totalAmount: number;
    evidenceUrl?: string;
  }): { success: boolean; message?: string } => {
    // Strict Validation: Cannot disburse more than available balance!
    if (payload.totalAmount > donationSummary.balanceAvailable) {
      return {
        success: false,
        message: `Nominal penyaluran (Rp${payload.totalAmount.toLocaleString('id-ID')}) melebihi sisa saldo sedekah yang tersedia (Rp${donationSummary.balanceAvailable.toLocaleString('id-ID')}).`,
      };
    }

    const newDist: DonationDistribution = {
      id: `dist-${Date.now()}`,
      distributionCode: `DIST-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      title: payload.title,
      description: payload.description,
      targetInstitution: payload.targetInstitution,
      totalAmount: payload.totalAmount,
      status: 'pending', // Newly added distribution MUST be pending until Takmir verifies!
      distributedAt: new Date().toISOString().slice(0, 10),
      evidence: payload.evidenceUrl
        ? [
            {
              id: `ev-${Date.now()}`,
              fileName: 'Bukti-Penyaluran-Baru.pdf',
              fileUrl: payload.evidenceUrl,
              verificationStatus: 'pending',
              uploadedBy: currentUser?.fullName || 'Pengelola Kedai',
              notes: 'Menunggu peninjauan dan stempel verifikasi Takmir.',
            },
          ]
        : [],
    };

    setDonationDistributions((prev) => [newDist, ...prev]);

    addAuditLog(
      'CREATE_DONATION_DISTRIBUTION',
      `Pencatatan rencana penyaluran sedekah ${newDist.distributionCode} sebesar Rp${payload.totalAmount.toLocaleString('id-ID')} kepada ${payload.targetInstitution} (Status: Pending)`
    );

    return { success: true };
  };

  const updateEvidenceStatus = (
    distributionId: string,
    evidenceId: string,
    newStatus: EvidenceStatus,
    verifierName = 'Takmir Masjid Kampus UNIB',
    rejectionReason?: string
  ) => {
    setDonationDistributions((prev) =>
      prev.map((dist) => {
        if (dist.id === distributionId) {
          const updatedEvidence = dist.evidence.map((ev) =>
            ev.id === evidenceId
              ? {
                  ...ev,
                  verificationStatus: newStatus,
                  verifiedBy: newStatus === 'verified' ? verifierName : undefined,
                  verifiedAt: newStatus === 'verified' ? new Date().toLocaleString('id-ID') : undefined,
                  rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
                }
              : ev
          );

          const hasVerified = updatedEvidence.some((e) => e.verificationStatus === 'verified');
          const isRejected = updatedEvidence.every((e) => e.verificationStatus === 'rejected');

          return {
            ...dist,
            evidence: updatedEvidence,
            status: hasVerified ? 'verified' : isRejected ? 'rejected' : 'pending',
          };
        }
        return dist;
      })
    );

    addAuditLog(
      'VERIFY_DONATION_EVIDENCE',
      `Verifikasi berkas bukti penyaluran pada distribusi ID ${distributionId} diubah menjadi ${newStatus.toUpperCase()}${rejectionReason ? ` (Alasan: ${rejectionReason})` : ''}`
    );
  };

  // Real-time KPI Stats (Excluding cancelled orders!)
  const completedOrders = orders.filter((o) => o.status === 'completed' && o.paymentStatus === 'paid');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalHpp = completedOrders.reduce((sum, o) => sum + o.totalHpp, 0);
  const grossProfit = totalRevenue - totalHpp;

  const paidCosts = operationalCosts
    .filter((c) => c.paymentStatus === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const unpaidCosts = operationalCosts
    .filter((c) => c.paymentStatus === 'unpaid')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalCosts = paidCosts;
  const currentNetProfit = grossProfit - totalCosts;

  const takmirRatio = mudharabahSetting.shahibulMaalRatio / 100;
  const takmirShare = currentNetProfit > 0 ? Math.floor(currentNetProfit * takmirRatio) : 0;
  const operatorShare = currentNetProfit > 0 ? currentNetProfit - takmirShare : 0;

  const totalBusinessCash = totalRevenue - paidCosts;
  const totalRecordedFunds = totalBusinessCash + donationSummary.balanceAvailable;

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole: handleRoleChange,
        currentUser,
        logout,
        isSupabaseConnected,
        products,
        toggleProductAvailability,
        updateProductPrice,
        updateProductDetails,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isDonationOptIn,
        setIsDonationOptIn,
        totalPortionsInCart,
        subtotalInCart,
        donationInCart,
        totalPaymentInCart,
        orders,
        myOrderNumbers,
        createOrder,
        createWalkinOrder,
        updateOrderStatus,
        recordOrderPayment,
        operationalCosts,
        addOperationalCost,
        mudharabahSetting,
        nisbahHistory,
        updateNisbah,
        periodFilter,
        setPeriodFilter,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        currentDynamicReport,
        verifiedReports,
        publishedReport,
        togglePublishReport,
        submitCurrentReport,
        verifyCurrentReport,
        rejectCurrentReport,
        financialReport: currentDynamicReport,
        submitFinancialReport: submitCurrentReport,
        verifyFinancialReport: (verifierName = 'Takmir Masjid Kampus') => verifyCurrentReport(verifierName),
        rejectFinancialReport: (notes = 'Perlu evaluasi takmir') => rejectCurrentReport(notes),
        donationDistributions,
        donationSummary,
        updateEvidenceStatus,
        addDonationDistribution,
        auditLogs,
        addAuditLog,
        stats: {
          totalRevenue,
          totalHpp,
          grossProfit,
          totalCosts,
          paidCosts,
          unpaidCosts,
          currentNetProfit,
          takmirShare,
          operatorShare,
          totalBusinessCash,
          totalSedekahCollected: donationSummary.totalReceived,
          totalSedekahDisbursed: donationSummary.totalDisbursed,
          sedekahBalance: donationSummary.balanceAvailable,
          totalRecordedFunds,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
