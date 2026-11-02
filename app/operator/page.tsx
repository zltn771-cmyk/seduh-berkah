'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { OrderStatus, OperationalCostType, Product, Order } from '@/types';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import {
  Coffee,
  CheckCircle2,
  Clock,
  Plus,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  ListOrdered,
  FileText,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  CreditCard,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { SimulationBadge } from '@/components/shared/SimulationBadge';

export default function OperatorDashboardPage() {
  const {
    products,
    toggleProductAvailability,
    updateProductPrice,
    updateProductDetails,
    orders,
    updateOrderStatus,
    recordOrderPayment,
    createWalkinOrder,
    operationalCosts,
    addOperationalCost,
    financialReport,
    submitFinancialReport,
    stats,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'walkin' | 'menu' | 'costs' | 'rekap'>('orders');

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<Order | null>(null);

  // Walk-in POS local state
  const [walkinCustomerName, setWalkinCustomerName] = useState<string>('Pelanggan Walk-in');
  const [walkinDonationOptIn, setWalkinDonationOptIn] = useState<boolean>(false);
  const [walkinNotes, setWalkinNotes] = useState<string>('');
  const [walkinItems, setWalkinItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: products[0]?.id || 'prod-1', quantity: 1 },
  ]);
  const [walkinPayImmediately, setWalkinPayImmediately] = useState<boolean>(true);

  // Cost Form State
  const [costDate, setCostDate] = useState<string>('2026-11-02');
  const [costType, setCostType] = useState<OperationalCostType>('variable_cost');
  const [costDescription, setCostDescription] = useState<string>('');
  const [costAmount, setCostAmount] = useState<number>(15000);
  const [costPaymentStatus, setCostPaymentStatus] = useState<'paid' | 'unpaid'>('paid');

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState<string>('');

  // Counters for today's active flow
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const processingOrders = orders.filter((o) => o.status === 'processing' || o.status === 'confirmed' || o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (orderStatusFilter === 'all') return true;
    if (orderStatusFilter === 'processing') {
      return order.status === 'processing' || order.status === 'confirmed' || order.status === 'preparing';
    }
    return order.status === orderStatusFilter;
  });

  // Handle Walk-in POS Item changes
  const addWalkinItem = () => {
    setWalkinItems([...walkinItems, { productId: products[0]?.id || 'prod-1', quantity: 1 }]);
  };

  const removeWalkinItem = (index: number) => {
    setWalkinItems(walkinItems.filter((_, i) => i !== index));
  };

  const updateWalkinItemProduct = (index: number, productId: string) => {
    const updated = [...walkinItems];
    updated[index].productId = productId;
    setWalkinItems(updated);
  };

  const updateWalkinItemQuantity = (index: number, quantity: number) => {
    const updated = [...walkinItems];
    updated[index].quantity = Math.max(1, quantity);
    setWalkinItems(updated);
  };

  const handleCreateWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walkinItems.length === 0) {
      alert('Pilih minimal satu minuman untuk pesanan walk-in.');
      return;
    }

    const created = createWalkinOrder({
      customerName: walkinCustomerName,
      items: walkinItems,
      isDonationOptIn: walkinDonationOptIn,
      notes: walkinNotes,
      isPaidImmediately: walkinPayImmediately,
    });

    alert(
      `Pesanan Walk-in ${created.orderNumber} berhasil dibuat!\n` +
      `Subtotal Kopi: ${formatRupiah(created.subtotal)}\n` +
      `Sedekah Sukarela: ${formatRupiah(created.donationAmount)}\n` +
      `Total Uang Diterima: ${formatRupiah(created.totalReceived)}\n` +
      `Status Bayar: ${created.paymentStatus.toUpperCase()}`
    );

    // Reset Walk-in form
    setWalkinCustomerName('Pelanggan Walk-in');
    setWalkinDonationOptIn(false);
    setWalkinNotes('');
    setWalkinItems([{ productId: products[0]?.id || 'prod-1', quantity: 1 }]);
    setActiveTab('orders');
  };

  // Status transition handler
  const handleTransition = (orderId: string, nextStatus: OrderStatus) => {
    let reason: string | undefined = undefined;
    if (nextStatus === 'cancelled') {
      const inputReason = prompt('Masukkan alasan pembatalan pesanan:');
      if (!inputReason) return;
      reason = inputReason;
    }

    const result = updateOrderStatus(orderId, nextStatus, reason);
    if (!result.success) {
      alert(`Gagal: ${result.message}`);
    }
  };

  // Payment Settlement handler
  const handlePayAndComplete = (order: Order) => {
    const confirmText =
      `Konfirmasi Penerimaan Uang Tunai di Kasir:\n` +
      `• Penjualan Kopi: ${formatRupiah(order.subtotal)}\n` +
      `• Sedekah Sukarela: ${formatRupiah(order.donationAmount)}\n` +
      `• TOTAL DITERIMA: ${formatRupiah(order.totalReceived)}\n\n` +
      `Apakah uang tunai telah diterima pas dari pelanggan?`;

    if (!confirm(confirmText)) return;

    const result = recordOrderPayment(order.id, 'Barista Kasir');
    if (result.success) {
      alert(`Pembayaran ${order.orderNumber} berhasil dicatat! Status pesanan kini COMPLETED.`);
    } else {
      alert(`Gagal merekam pembayaran: ${result.message}`);
    }
  };

  // Cost submission
  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costDescription.trim() || costAmount <= 0) return;

    addOperationalCost({
      date: costDate,
      costType,
      description: costDescription.trim(),
      amount: costAmount,
      paymentStatus: costPaymentStatus,
    });

    setCostDescription('');
    setCostAmount(15000);
    alert('Biaya operasional berhasil dicatat ke dalam buku kas.');
  };

  // Product edit submit
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProductDetails(editingProduct.id, {
      price: editPrice,
      description: editDescription,
    });

    alert(`Perubahan untuk menu "${editingProduct.name}" berhasil disimpan.`);
    setEditingProduct(null);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FDFBF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Operator Banner */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-[#2C1810] text-[#FDFBF7] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-[#2C1810] uppercase tracking-wider">
                OPERATIONAL &amp; POS SYSTEM (MUDHARIB)
              </span>
              <SimulationBadge />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Sistem Operasional &amp; Kasir Kedai
            </h1>
            <p className="text-xs text-[#E8DBCB]/80 max-w-xl">
              Alur pemrosesan pesanan pre-order daring, input kasir langsung (*walk-in*), pembaruan menu, pencatatan pembayaran tunai, dan biaya harian.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-1 text-[#E8DBCB]/90">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldAlert className="h-4 w-4" />
              <span>Otoritas Operasional</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Memproses pesanan dan mencatat pembayaran. Pembagian hasil 60:40 dan verifikasi laporan bulanan berada di bawah wewenang Takmir.
            </p>
          </div>
        </div>

        {/* 4 Summary Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
            <span className="text-xs font-semibold text-amber-800">1. Pesanan Baru</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl font-bold text-amber-950">
                {pendingOrders.length}
              </span>
              <span className="text-[11px] text-amber-700">Perlu Konfirmasi</span>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 shadow-2xs">
            <span className="text-xs font-semibold text-orange-800">2. Sedang Diseduh</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl font-bold text-orange-950">
                {processingOrders.length}
              </span>
              <span className="text-[11px] text-orange-700">Di Barista</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
            <span className="text-xs font-semibold text-emerald-800">3. Siap Diambil</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl font-bold text-emerald-950">
                {readyOrders.length}
              </span>
              <span className="text-[11px] text-emerald-700">Tunggu Pelanggan</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 shadow-2xs">
            <span className="text-xs font-semibold text-gray-700">4. Selesai Hari Ini</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl font-bold text-gray-900">
                {completedOrders.length}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {formatRupiah(stats.totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DBCB] gap-2 overflow-x-auto pb-px">
          {[
            { id: 'orders', label: `Antrean Pesanan (${orders.length})`, icon: ListOrdered },
            { id: 'walkin', label: 'Kasir Walk-in (+Order Langsung)', icon: Plus },
            { id: 'menu', label: 'Pengelolaan Menu & Ketersediaan', icon: Coffee },
            { id: 'costs', label: 'Pencatatan Biaya & Waste', icon: DollarSign },
            { id: 'rekap', label: 'Rekapitulasi Operasional', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-[#8E5230] bg-white text-[#8E5230] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8DBCB]">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Cari nomor pesanan atau nama pelanggan..."
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-xs text-gray-900 focus:border-[#8E5230] outline-hidden"
                />
              </div>

              {/* Status Tabs Filter */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'processing', label: 'Processing' },
                  { id: 'ready', label: 'Ready' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      orderStatusFilter === st.id
                        ? 'bg-[#2C1810] text-white font-bold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-[#E8DBCB] bg-white p-8 text-center text-xs text-gray-500">
                  Tidak ada pesanan yang sesuai dengan filter.
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isProcessing =
                    order.status === 'processing' || order.status === 'confirmed' || order.status === 'preparing';

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-[#E8DBCB] bg-white p-5 shadow-2xs space-y-4 hover:border-[#8E5230]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#8E5230]">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs font-semibold text-gray-800">
                              {order.customerName}
                            </span>
                            {order.customerPhone && (
                              <span className="text-[11px] text-gray-500">({order.customerPhone})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>{formatDateTime(order.createdAt)}</span>
                            <span>•</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                              {order.orderSource === 'walk_in_pos' || order.orderSource === 'walk_in'
                                ? 'Walk-in Kasir Langsung'
                                : 'Pre-order Web'}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                              order.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isProcessing
                                ? 'bg-orange-100 text-orange-900 border border-orange-300 animate-pulse'
                                : order.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold'
                                : order.status === 'completed'
                                ? 'bg-gray-100 text-gray-800 border border-gray-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Item and Price Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-semibold text-gray-700 block mb-1">Daftar Minuman:</span>
                          <ul className="space-y-1 text-gray-600">
                            {order.items.map((it, idx) => (
                              <li key={idx} className="flex justify-between max-w-xs">
                                <span>
                                  • {it.quantity}× {it.productName}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {formatRupiah(it.subtotal)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {order.notes && (
                            <p className="mt-1.5 text-[11px] italic text-amber-800 bg-amber-50 p-2 rounded-lg">
                              Catatan: &ldquo;{order.notes}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right space-y-1 bg-[#FDFBF7] p-3 rounded-xl border border-gray-100">
                          <div className="text-gray-500">
                            Subtotal Penjualan Produk:{' '}
                            <strong className="text-gray-900">{formatRupiah(order.subtotal)}</strong>
                          </div>
                          <div className="text-emerald-700">
                            Sedekah Sukarela:{' '}
                            <strong>+{formatRupiah(order.donationAmount)}</strong>
                          </div>
                          <div className="text-sm font-bold text-[#2C1810] pt-1 border-t border-gray-200">
                            Total Bayar di Kasir: {formatRupiah(order.totalReceived)}
                          </div>
                          <div className="text-[11px] pt-1">
                            Status Bayar:{' '}
                            <strong
                              className={
                                order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                              }
                            >
                              {order.paymentStatus === 'paid' ? '✓ LUNAS (PAID)' : '⏳ BELUM DIBAYAR (UNPAID)'}
                            </strong>
                          </div>
                          {order.completedAt && (
                            <div className="text-[10px] text-gray-400">
                              Diselesaikan pada: {formatDateTime(order.completedAt)}
                            </div>
                          )}
                          {order.cancellationReason && (
                            <div className="text-[11px] text-red-600">
                              Alasan batal: {order.cancellationReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Operator Workflow Action Buttons */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-end items-center">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleTransition(order.id, 'processing')}
                            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700"
                          >
                            ☕ Proses Seduhan (Processing)
                          </button>
                        )}

                        {isProcessing && (
                          <button
                            onClick={() => handleTransition(order.id, 'ready')}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            🔔 Tandai Siap Diambil di Konter (Ready)
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <button
                            onClick={() => handlePayAndComplete(order)}
                            className="rounded-xl bg-[#2C1810] px-4 py-2 text-xs font-bold text-white hover:bg-[#8E5230] flex items-center gap-1.5"
                          >
                            <CreditCard className="h-3.5 w-3.5 text-amber-300" />
                            <span>Terima Pembayaran Tunai &amp; Selesaikan (Completed)</span>
                          </button>
                        )}

                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleTransition(order.id, 'cancelled')}
                            className="rounded-xl border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Batalkan Pesanan
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WALKIN POS */}
        {activeTab === 'walkin' && (
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                Kasir Pemesanan Langsung (Walk-in POS)
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Catat pesanan pelanggan yang datang langsung ke meja bar kedai tanpa menggunakan website.
              </p>
            </div>

            <form onSubmit={handleCreateWalkinSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nama Pelanggan Walk-in
                </label>
                <input
                  type="text"
                  required
                  value={walkinCustomerName}
                  onChange={(e) => setWalkinCustomerName(e.target.value)}
                  placeholder="Contoh: Dosen FEB / Mahasiswa"
                  className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-800"
                />
              </div>

              {/* Items in walkin order */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Daftar Minuman:</label>
                {walkinItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.productId}
                      onChange={(e) => updateWalkinItemProduct(idx, e.target.value)}
                      className="flex-1 rounded-xl border border-[#E8DBCB] p-2 text-gray-800 bg-[#FDFBF7]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatRupiah(p.price)}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={item.quantity}
                      onChange={(e) => updateWalkinItemQuantity(idx, parseInt(e.target.value) || 1)}
                      className="w-16 rounded-xl border border-[#E8DBCB] p-2 text-center text-gray-800 font-bold"
                    />

                    {walkinItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWalkinItem(idx)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addWalkinItem}
                  className="text-xs font-semibold text-[#8E5230] hover:underline flex items-center gap-1 pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Tambah Varian Menu Lain</span>
                </button>
              </div>

              {/* Sedekah Sukarela Checkbox */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={walkinDonationOptIn}
                    onChange={(e) => setWalkinDonationOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2D5A43] accent-[#2D5A43]"
                  />
                  <div>
                    <span className="font-semibold text-[#2D5A43]">
                      Ikut Bersedekah Sukarela (+Rp1.000 / porsi)
                    </span>
                    <span className="block text-[11px] text-gray-600 mt-0.5">
                      Tanyakan kepada pelanggan apakah bersedia menyisihkan Rp1.000 untuk kas amanah sedekah masjid.
                    </span>
                  </div>
                </label>
              </div>

              {/* Payment Immediate Option */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={walkinPayImmediately}
                    onChange={(e) => setWalkinPayImmediately(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#8E5230] accent-[#8E5230]"
                  />
                  <div>
                    <span className="font-semibold text-[#8E5230]">
                      Uang Tunai Telah Diterima Pas (Tandai Selesai &amp; Lunas)
                    </span>
                  </div>
                </label>
              </div>

              {/* Calculation summary */}
              {(() => {
                let sub = 0;
                let portions = 0;
                walkinItems.forEach((it) => {
                  const prod = products.find((p) => p.id === it.productId) || products[0];
                  sub += prod.price * it.quantity;
                  portions += it.quantity;
                });
                const don = walkinDonationOptIn ? portions * 1000 : 0;
                return (
                  <div className="rounded-xl bg-[#F5EBE1] p-4 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal Minuman ({portions} porsi):</span>
                      <strong className="text-gray-900">{formatRupiah(sub)}</strong>
                    </div>
                    <div className="flex justify-between text-[#2D5A43]">
                      <span>Sedekah Sukarela:</span>
                      <strong>{formatRupiah(don)}</strong>
                    </div>
                    <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-sm text-[#2C1810]">
                      <span>Total Bayar Tunai:</span>
                      <span>{formatRupiah(sub + don)}</span>
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#2C1810] py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
              >
                Simpan &amp; Catat Transaksi Walk-in
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#2C1810]">
                  Pengelolaan Menu &amp; Stok Kedai
                </h2>
                <p className="text-xs text-gray-500">
                  Perubahan harga tersimpan untuk transaksi baru. Transaksi masa lalu mempertahankan harga snapshot.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#E8DBCB] bg-white p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#2C1810]">{p.name}</h3>
                      <span className="text-[11px] text-[#8E5230]">{p.categoryLabel}</span>
                    </div>
                    <button
                      onClick={() => toggleProductAvailability(p.id)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        p.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.isAvailable ? 'Tersedia' : 'Habis'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>

                  <div className="text-xs space-y-1 text-gray-600 pt-1 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Harga Jual:</span>
                      <strong className="text-gray-900">{formatRupiah(p.price)}</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>HPP Bahan Baku:</span>
                      <span>{formatRupiah(p.hpp)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-emerald-700">
                      <span>Margin Kotor:</span>
                      <span>{formatRupiah(p.price - p.hpp)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditPrice(p.price);
                        setEditDescription(p.description);
                      }}
                      className="text-xs text-[#8E5230] hover:underline font-semibold"
                    >
                      Edit Detail &amp; Harga
                    </button>
                    <span className="text-[10px] text-gray-400">
                      {p.isAvailable ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit Product */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Edit Menu: {editingProduct.name}
                  </h3>
                  <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Harga Jual (Rp)</label>
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-gray-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Deskripsi Menu</label>
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 p-2 text-gray-900"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#2C1810] font-bold text-white hover:bg-[#8E5230]"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: OPERATIONAL COSTS & WASTE */}
        {activeTab === 'costs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Form */}
            <div className="lg:col-span-5 rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-sm space-y-4 text-xs">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Pencatatan Biaya &amp; Waste Kedai
                </h3>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Pisahkan biaya tetap dan variabel. Biaya belum dibayar (unpaid) tidak dihitung sebagai arus kas keluar.
                </p>
              </div>

              <form onSubmit={handleAddCost} className="space-y-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={costDate}
                    onChange={(e) => setCostDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DBCB] p-2 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori Biaya</label>
                  <select
                    value={costType}
                    onChange={(e) => setCostType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E8DBCB] p-2 text-gray-800 bg-[#FDFBF7]"
                  >
                    <option value="variable_cost">Biaya Variabel (Gas, Es Batu, Sabun, Sedotan)</option>
                    <option value="fixed_cost">Biaya Tetap (Sewa / Listrik Bulanan)</option>
                    <option value="waste_loss">Bahan Terbuang / Gagal Seduh (Waste Loss)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status Pembayaran</label>
                  <select
                    value={costPaymentStatus}
                    onChange={(e) => setCostPaymentStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E8DBCB] p-2 text-gray-800 bg-[#FDFBF7]"
                  >
                    <option value="paid">Lunas / Sudah Dibayar Tunai (Paid)</option>
                    <option value="unpaid">Belum Dibayar / Tagihan Utang (Unpaid)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nama / Uraian Biaya</label>
                  <input
                    type="text"
                    required
                    value={costDescription}
                    onChange={(e) => setCostDescription(e.target.value)}
                    placeholder="Contoh: Beli es batu kristal 2 bungkus"
                    className="w-full rounded-xl border border-[#E8DBCB] p-2 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={costAmount}
                    onChange={(e) => setCostAmount(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#E8DBCB] p-2 text-gray-800 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#2C1810] py-2.5 font-bold text-white hover:bg-[#8E5230] transition-colors"
                >
                  + Catat Pengeluaran
                </button>
              </form>
            </div>

            {/* List of Costs */}
            <div className="lg:col-span-7 rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  Buku Pengeluaran Operasional
                </h3>
                <span className="text-xs text-gray-500">
                  Total Terbayar: <strong className="text-red-700">{formatRupiah(stats.paidCosts)}</strong>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {operationalCosts.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#FDFBF7]"
                  >
                    <div>
                      <span className="font-semibold text-gray-800 block">{c.description}</span>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span>{c.date}</span>
                        <span>•</span>
                        <span className="capitalize font-medium text-[#8E5230]">
                          {c.costType.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            c.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {c.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-red-700">
                      − {formatRupiah(c.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REKAPITULASI DRAFT OPERATOR */}
        {activeTab === 'rekap' && (
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                  Rekapitulasi Operasional Bulan Berjalan
                </h2>
                <span className="text-xs text-gray-500">
                  Status Laporan:{' '}
                  <strong className="uppercase text-[#8E5230]">{financialReport.status}</strong>
                </span>
              </div>

              {financialReport.status === 'draft' || financialReport.status === 'rejected' ? (
                <button
                  onClick={() => {
                    submitFinancialReport();
                    alert('Laporan bulanan telah diajukan kepada Takmir (Shahibul Maal) untuk diverifikasi.');
                  }}
                  className="rounded-xl bg-[#2D5A43] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#20402E] transition-colors"
                >
                  Ajukan Laporan ke Takmir
                </button>
              ) : (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-900">
                  Menunggu atau Selesai Diverifikasi Takmir
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl border border-gray-200 bg-[#FDFBF7] p-4 space-y-1">
                <span className="text-gray-500">Total Penjualan Selesai (Completed Only)</span>
                <span className="font-serif text-lg font-bold text-gray-900 block">
                  {formatRupiah(stats.totalRevenue)}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FDFBF7] p-4 space-y-1">
                <span className="text-gray-500">Total HPP Barang Terjual</span>
                <span className="font-serif text-lg font-bold text-red-700 block">
                  {formatRupiah(stats.totalHpp)}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#FDFBF7] p-4 space-y-1">
                <span className="text-gray-500">Total Biaya Operasional (Kas Keluar)</span>
                <span className="font-serif text-lg font-bold text-red-700 block">
                  {formatRupiah(stats.paidCosts)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold">Estimasi Laba Bersih Sementara:</span>
              <span className="font-serif text-lg font-bold block text-[#2C1810]">
                {formatRupiah(stats.currentNetProfit)}
              </span>
              <p className="text-[11px] text-gray-600">
                Pesanan yang dibatalkan (*cancelled*) tidak dihitung ke pendapatan. Pembagian hasil final (60% Takmir : 40% Pengelola) disahkan secara resmi oleh Takmir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
