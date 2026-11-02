'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { OrderStatus } from '@/types';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import {
  Coffee,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Bell,
  Check,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orders, myOrderNumbers, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'my_orders' | 'all_queue'>('my_orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Identify customer's own orders:
  const myOrders = orders.filter((order) => {
    if (currentUser && order.customerName.toLowerCase().includes(currentUser.fullName.toLowerCase())) {
      return true;
    }
    return myOrderNumbers.includes(order.orderNumber);
  });

  const displayedOrders = (activeTab === 'my_orders' && myOrders.length > 0) ? myOrders : orders;

  const filteredOrders = displayedOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Menunggu Konfirmasi',
          color: 'bg-amber-100 text-amber-950 border-amber-300',
          desc: 'Pesanan Anda telah diterima sistem dan segera diproses barista.',
        };
      case 'processing':
      case 'confirmed':
      case 'preparing':
        return {
          label: 'Sedang Diseduh Barista ☕',
          color: 'bg-orange-100 text-orange-950 border-orange-300 animate-pulse font-bold',
          desc: 'Barista sedang meracik biji Robusta Bengkulu pilihan Anda dengan presisi.',
        };
      case 'ready':
        return {
          label: 'Siap Diambil di Konter! 🔔',
          color: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black shadow-xs ring-2 ring-emerald-300/60',
          desc: 'Minuman sudah siap di nampan saji. Silakan datangi serambi Masjid UNIB dan bayar tunai pas di kasir.',
        };
      case 'completed':
        return {
          label: 'Selesai & Lunas Tunai',
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          desc: 'Pesanan telah diambil dan pembayaran kasir telah diverifikasi.',
        };
      case 'cancelled':
        return {
          label: 'Dibatalkan',
          color: 'bg-red-100 text-red-800 border-red-300',
          desc: 'Pesanan dibatalkan.',
        };
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-r from-white via-[#FDFBF7] to-[#F5EFE6] p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8E5230] uppercase tracking-wider">
                Status Antrean Langsung
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-[#2D5A43] px-2.5 py-0.5 text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Update
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Pelacak &amp; Antrean Pesanan
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
              Pantau proses racikan cangkir kopi Anda secara langsung. Ambil dan bayar tunai di kasir serambi Masjid UNIB saat pesanan berstatus <strong className="text-emerald-800">Siap Diambil</strong>.
            </p>
          </div>

          <Link
            href="/menu"
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-2xl bg-[#2C1810] px-5 py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-sm"
          >
            <Coffee className="h-4 w-4 text-amber-300" />
            <span>Pesan Menu Baru</span>
          </Link>
        </div>

        {/* Tab Selection: Pesanan Saya vs Semua Antrean */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-2xl border border-[#E8DBCB] shadow-2xs">
            <button
              onClick={() => setActiveTab('my_orders')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'my_orders'
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-[#F5EFE6]'
              }`}
            >
              Pesanan Saya ({myOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('all_queue')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'all_queue'
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-[#F5EFE6]'
              }`}
            >
              Semua Antrean Kedai ({orders.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor SB-... atau nama"
              className="w-full rounded-2xl border border-[#E8DBCB] bg-white pl-10 pr-4 py-2 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-2 focus:ring-[#8E5230]/20 outline-hidden shadow-2xs"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6EFE6] text-[#8E5230]">
                <ShoppingBag className="h-7 w-7 text-amber-800" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                {activeTab === 'my_orders'
                  ? 'Belum Ada Pesanan Aktif di Perangkat Ini'
                  : 'Tidak Ada Pesanan yang Sesuai Pencarian'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Silakan lakukan pemesanan melalui katalog menu atau gunakan tab &ldquo;Semua Antrean Kedai&rdquo; untuk memeriksa nomor pesanan Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2C1810] px-6 py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-sm"
                >
                  <Coffee className="h-4 w-4 text-amber-300" />
                  <span>Pesan Kopi Sekarang</span>
                </Link>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const isProcessing =
                order.status === 'processing' || order.status === 'confirmed' || order.status === 'preparing';
              const isReady = order.status === 'ready';

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border bg-white p-6 sm:p-7 shadow-xs transition-all space-y-5 ${
                    isReady
                      ? 'border-emerald-400 ring-2 ring-emerald-400/20 glow-emerald'
                      : 'border-[#E8DBCB]/90 hover:border-[#8E5230]/40'
                  }`}
                >
                  {/* Ready alert badge */}
                  {isReady && (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-950 font-bold animate-pulse">
                      <Bell className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Kopi Anda sudah siap! Silakan menuju konter serambi Masjid UNIB untuk mengambil pesanan.</span>
                    </div>
                  )}

                  {/* Top metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base font-black text-[#8E5230]">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Dipesan: {formatDateTime(order.createdAt)}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-700">
                          {order.orderSource === 'walk_in_pos' || order.orderSource === 'walk_in'
                            ? 'Walk-in Kasir'
                            : 'Online Pre-order'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Modern 4-Step Progress Stepper */}
                  <div className="py-1">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                      <div
                        className={`rounded-xl py-2 px-1 font-bold transition-all ${
                          ['pending', 'processing', 'confirmed', 'preparing', 'ready', 'completed'].includes(order.status)
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        1. Diterima
                      </div>
                      <div
                        className={`rounded-xl py-2 px-1 font-bold transition-all ${
                          isProcessing || ['ready', 'completed'].includes(order.status)
                            ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-2xs'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        2. Diseduh ☕
                      </div>
                      <div
                        className={`rounded-xl py-2 px-1 font-bold transition-all ${
                          ['ready', 'completed'].includes(order.status)
                            ? 'bg-emerald-200 text-emerald-950 border border-emerald-400 shadow-xs'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        3. Siap Ambil ✨
                      </div>
                      <div
                        className={`rounded-xl py-2 px-1 font-bold transition-all ${
                          order.status === 'completed'
                            ? 'bg-gray-200 text-gray-900 border border-gray-400'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        4. Selesai ✓
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-2.5 italic">{statusInfo.desc}</p>
                  </div>

                  {/* Items List */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-xs font-bold text-gray-800 block">Rincian Cangkir:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-800">
                          <strong className="text-[#8E5230]">{item.quantity}×</strong> {item.productName}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.notes && (
                      <div className="text-[11px] italic text-amber-950 bg-amber-50/80 p-2.5 rounded-xl mt-2 border border-amber-200">
                        Catatan: &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown & Cash on Pickup Status */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DBCB]/70">
                    <div className="space-y-1">
                      <div className="text-gray-600">
                        Penjualan Minuman: <strong className="text-gray-900">{formatRupiah(order.subtotal)}</strong>
                      </div>
                      {order.donationAmount > 0 ? (
                        <div className="flex items-center gap-1.5 text-[#2D5A43] font-bold">
                          <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Sedekah Sukarela: +{formatRupiah(order.donationAmount)}</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-[11px]">Tanpa sedekah sukarela</div>
                      )}
                    </div>

                    <div className="sm:text-right space-y-0.5">
                      <div className="text-gray-500 text-[11px] uppercase tracking-wide">Total Pembayaran Kasir:</div>
                      <div className="font-serif text-xl font-black text-[#2C1810]">
                        {formatRupiah(order.totalReceived)}
                      </div>
                      <div className="text-[11px]">
                        Status:{' '}
                        <strong
                          className={
                            order.paymentStatus === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'
                          }
                        >
                          {order.paymentStatus === 'paid' ? '✓ Lunas Tunai di Kasir' : '⏳ Bayar Tunai saat Pengambilan'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
