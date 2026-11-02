'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { Order, OrderStatus } from '@/types';
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
  CreditCard,
  User,
} from 'lucide-react';
import { SimulationBadge } from '@/components/shared/SimulationBadge';

export default function OrderTrackingPage() {
  const { orders, myOrderNumbers, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'my_orders' | 'all_queue'>('my_orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Identify customer's own orders:
  // Either matching customerId if logged in, or matching orderNumbers in myOrderNumbers from device checkout
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
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Pesanan Anda telah diterima sistem dan menunggu konfirmasi barista.',
        };
      case 'processing':
      case 'confirmed':
      case 'preparing':
        return {
          label: 'Sedang Diseduh Barista',
          color: 'bg-orange-100 text-orange-900 border-orange-300 animate-pulse',
          desc: 'Barista sedang meracik kopi Robusta Bengkulu pilihan Anda.',
        };
      case 'ready':
        return {
          label: 'Siap Diambil di Konter! ☕',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold',
          desc: 'Minuman sudah siap. Silakan ambil di serambi Masjid UNIB dan bayar tunai di kasir.',
        };
      case 'completed':
        return {
          label: 'Selesai & Lunas Tunai',
          color: 'bg-gray-100 text-gray-700 border-gray-300',
          desc: 'Pesanan telah diambil dan pembayaran telah diterima.',
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
    <div className="py-10 sm:py-16 bg-[#FDFBF7]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DBCB]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8E5230] uppercase tracking-wider">
                Pelacak Antrean &amp; Riwayat
              </span>
              <SimulationBadge />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
              Status &amp; Riwayat Pesanan
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Pantau proses seduhan minuman Anda secara langsung. Ambil dan bayar tunai di konter serambi Masjid UNIB saat berstatus{' '}
              <strong className="text-emerald-700 font-semibold">Siap Diambil</strong>.
            </p>
          </div>

          <Link
            href="/menu"
            className="self-start sm:self-auto rounded-xl bg-[#2C1810] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8E5230] transition-colors"
          >
            + Pesan Kopi Baru
          </Link>
        </div>

        {/* Tab Selection: Pesanan Saya vs Semua Antrean */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('my_orders')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'my_orders'
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EBE1]'
              }`}
            >
              Pesanan Saya ({myOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('all_queue')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === 'all_queue'
                  ? 'bg-[#2C1810] text-white shadow-xs'
                  : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EBE1]'
              }`}
            >
              Semua Antrean Kedai ({orders.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor SB-... atau nama"
              className="w-full rounded-xl border border-[#E8DBCB] bg-white pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:border-[#8E5230] outline-hidden shadow-2xs"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-10 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5EBE1] text-[#8E5230]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2C1810]">
                {activeTab === 'my_orders'
                  ? 'Belum Ada Pesanan yang Dibuat di Perangkat Ini'
                  : 'Tidak Ada Pesanan yang Sesuai Pencarian'}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Silakan lakukan pemesanan melalui menu atau gunakan tab &ldquo;Semua Antrean Kedai&rdquo; untuk mencari pesanan Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2C1810] px-4 py-2 text-xs font-bold text-white hover:bg-[#8E5230]"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Pesan Kopi Sekarang</span>
                </Link>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const isProcessing =
                order.status === 'processing' || order.status === 'confirmed' || order.status === 'preparing';

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-2xs hover:border-[#8E5230]/40 transition-colors space-y-4"
                >
                  {/* Top order metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#8E5230]">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-gray-800">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Dipesan: {formatDateTime(order.createdAt)}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {order.orderSource === 'walk_in_pos' || order.orderSource === 'walk_in'
                            ? 'Walk-in Kasir'
                            : 'Online Pre-order'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Status Visual Progress Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                      <div
                        className={`rounded-lg py-2 px-1 font-semibold ${
                          ['pending', 'processing', 'confirmed', 'preparing', 'ready', 'completed'].includes(order.status)
                            ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        1. Diterima
                      </div>
                      <div
                        className={`rounded-lg py-2 px-1 font-semibold ${
                          isProcessing || ['ready', 'completed'].includes(order.status)
                            ? 'bg-orange-100 text-orange-950 font-bold border border-orange-300'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        2. Diseduh
                      </div>
                      <div
                        className={`rounded-lg py-2 px-1 font-semibold ${
                          ['ready', 'completed'].includes(order.status)
                            ? 'bg-emerald-200 text-emerald-950 font-bold border border-emerald-400'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        3. Siap Diambil
                      </div>
                      <div
                        className={`rounded-lg py-2 px-1 font-semibold ${
                          order.status === 'completed'
                            ? 'bg-gray-200 text-gray-900 font-bold border border-gray-400'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        4. Selesai
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-2 italic">{statusInfo.desc}</p>
                  </div>

                  {/* Items List */}
                  <div className="pt-3 border-t border-gray-100 space-y-1.5">
                    <span className="text-xs font-semibold text-gray-700 block mb-1">Rincian Minuman:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-800">
                          <strong>{item.quantity}×</strong> {item.productName}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.notes && (
                      <div className="text-[11px] italic text-amber-900 bg-amber-50/80 p-2 rounded-lg mt-2 border border-amber-200/60">
                        Catatan: &ldquo;{order.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown & Cash on Pickup Status */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs bg-[#FDFBF7] p-3.5 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <div className="text-gray-500">
                        Penjualan Kopi: <strong>{formatRupiah(order.subtotal)}</strong>
                      </div>
                      {order.donationAmount > 0 ? (
                        <div className="flex items-center gap-1.5 text-[#2D5A43] font-semibold">
                          <HeartHandshake className="h-3.5 w-3.5" />
                          <span>Sedekah Sukarela: +{formatRupiah(order.donationAmount)}</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-[11px]">Tanpa sedekah sukarela</div>
                      )}
                    </div>

                    <div className="sm:text-right space-y-0.5">
                      <div className="text-gray-500 text-[11px]">Total Tagihan Kasir:</div>
                      <div className="font-serif text-lg font-bold text-[#2C1810]">
                        {formatRupiah(order.totalReceived)}
                      </div>
                      <div className="text-[11px]">
                        Status:{' '}
                        <strong
                          className={
                            order.paymentStatus === 'paid' ? 'text-emerald-700 font-bold' : 'text-amber-800'
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
