'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { formatRupiah } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  AlertCircle,
} from 'lucide-react';
import { SimulationBadge } from '@/components/shared/SimulationBadge';

export function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isDonationOptIn,
    setIsDonationOptIn,
    totalPortionsInCart,
    subtotalInCart,
    donationInCart,
    totalPaymentInCart,
    createOrder,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [receiptSummary, setReceiptSummary] = useState<{ portions: number; subtotal: number; donation: number; total: number } | null>(null);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!customerName.trim()) {
      alert('Mohon masukkan nama pemesan.');
      return;
    }

    setIsSubmitting(true);
    const summary = {
      portions: totalPortionsInCart,
      subtotal: subtotalInCart,
      donation: donationInCart,
      total: totalPaymentInCart,
    };
    setReceiptSummary(summary);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName,
        customerPhone,
        notes,
        orderSource: 'online_web',
      });
      setIsSubmitting(false);
      setCreatedOrderNumber(newOrder.orderNumber);
    }, 400);
  };

  // If order was just created, show confirmation receipt
  if (createdOrderNumber) {
    return (
      <div className="py-12 sm:py-20 bg-[#FDFBF7]">
        <div className="mx-auto max-w-lg px-4">
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 text-center shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#2D5A43] mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <SimulationBadge label="PESANAN TERCATAT" />

            <h1 className="font-serif text-2xl font-bold text-[#2C1810] mt-3">
              Pesanan Berhasil Dikirim!
            </h1>

            <p className="mt-2 text-xs text-gray-600">
              Silakan simpan nomor antrean Anda dan lakukan pembayaran tunai saat mengambil pesanan di kasir kedai.
            </p>

            {/* Ticket Card */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[#8E5230]/40 bg-[#FDFBF7] p-5 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-xs text-gray-500">Nomor Pesanan</span>
                <span className="font-mono text-sm font-bold text-[#8E5230]">
                  {createdOrderNumber}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Pemesan</span>
                <span className="font-semibold text-gray-800">{customerName}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Metode Bayar</span>
                <span className="font-semibold text-gray-800">Tunai saat Ambil (Cash-on-Pickup)</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Porsi Minuman</span>
                <span className="font-semibold text-gray-800">{receiptSummary?.portions || 1} Porsi</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Subtotal Minuman</span>
                <span className="font-semibold text-gray-800">{formatRupiah(receiptSummary?.subtotal || 0)}</span>
              </div>

              {receiptSummary && receiptSummary.donation > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-700">
                  <span>Sedekah Sukarela</span>
                  <span className="font-semibold">+{formatRupiah(receiptSummary.donation)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-bold">Total Harus Dibayar di Kasir</span>
                <span className="font-serif text-base font-bold text-[#2C1810]">
                  {formatRupiah(receiptSummary?.total || 0)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Link
                href="/pesanan"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2C1810] px-5 py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
              >
                <span>Lihat Status Antrean Pesanan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => {
                  setCreatedOrderNumber(null);
                  router.push('/menu');
                }}
                className="w-full text-xs font-semibold text-gray-600 hover:text-gray-900 py-2"
              >
                Kembali ke Katalog Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FDFBF7]">
        <div className="mx-auto max-w-md px-4 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5EBE1] text-[#8E5230]">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Keranjang Masih Kosong
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Belum ada menu yang Anda pilih. Silakan lihat katalog Robusta Bengkulu kami untuk memesan minuman favorit Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2C1810] px-6 py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
            >
              <Coffee className="h-4 w-4" />
              <span>Pilih Menu Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FDFBF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#E8DBCB] flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Keranjang &amp; Pemesanan
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Periksa item pesanan Anda sebelum mengonfirmasi pengambilan di kedai.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-medium text-red-600 hover:text-red-700 underline"
          >
            Kosongkan Keranjang
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#E8DBCB] bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-[#2C1810]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#2C1810]">
                      {product.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#8E5230]">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="block text-[11px] text-gray-500">
                      Subtotal: {formatRupiah(product.price * quantity)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-[#E8DBCB] bg-[#FDFBF7]">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-[#2C1810]"
                      aria-label="Kurangi porsi"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#2C1810]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-gray-600 hover:text-[#2C1810]"
                      aria-label="Tambah porsi"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* VOLUNTARY DONATION OPT-IN BOX */}
            <div className="rounded-2xl border-2 border-emerald-300/80 bg-emerald-50/50 p-5 shadow-xs transition-all">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sedekah-toggle"
                  checked={isDonationOptIn}
                  onChange={(e) => setIsDonationOptIn(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#2D5A43] focus:ring-[#2D5A43] accent-[#2D5A43] cursor-pointer"
                />
                <label htmlFor="sedekah-toggle" className="cursor-pointer select-none space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#2D5A43]">
                      Ikut Bersedekah Produktif (+Rp1.000 / porsi)
                    </span>
                    <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">
                      SUKARELA
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Sedekah ini <strong>bersifat sukarela</strong> dan <strong>dicatat terpisah mutlak</strong> dari kas usaha kedai. Dana yang terkumpul disalurkan untuk mahasiswa dhuafa dan program sosial masjid kampus via lembaga amil zakat berizin.
                  </p>
                  {isDonationOptIn && (
                    <div className="pt-2 text-xs font-semibold text-[#2D5A43]">
                      ✓ Anda bersedekah {formatRupiah(donationInCart)} ({totalPortionsInCart} porsi × Rp1.000)
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form & Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#2C1810]">
                  Rincian Pembayaran
                </h2>
                <span className="text-[11px] text-gray-500">
                  Pembayaran tunai di kasir saat mengambil pesanan
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs border-y border-[#E8DBCB] py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Kopi &amp; Menu ({totalPortionsInCart} porsi)</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(subtotalInCart)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <HeartHandshake className="h-3.5 w-3.5 text-[#2D5A43]" />
                    <span>Sedekah Sukarela (Amanah Titipan)</span>
                  </div>
                  <span className={`font-semibold ${isDonationOptIn ? 'text-[#2D5A43]' : 'text-gray-400'}`}>
                    {isDonationOptIn ? formatRupiah(donationInCart) : 'Rp0'}
                  </span>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-baseline font-bold text-[#2C1810]">
                  <span className="text-sm">Total Bayar di Kasir</span>
                  <span className="font-serif text-xl text-[#2C1810]">
                    {formatRupiah(totalPaymentInCart)}
                  </span>
                </div>
              </div>

              {/* Customer Input Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Pemesan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Fajar (Mahasiswa FKIP)"
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nomor WhatsApp / Kontak (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
                  />
                  <span className="text-[10px] text-gray-500">
                    Memudahkan barista memanggil atau menghubungi jika diperlukan.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Catatan Pesanan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Gula aren dipisah / seduhan panas disajikan baqda ashar"
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
                  />
                </div>

                {/* Cash-on-Pickup Note */}
                <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <p>
                    <strong>Metode Cash-on-Pickup:</strong> Pesanan langsung dibuat barista. Anda membayar tunai pas di kasir saat mengambil minuman di serambi Masjid Kampus UNIB.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2C1810] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#8E5230] active:scale-98 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Pesanan...</span>
                  ) : (
                    <>
                      <span>Konfirmasi Pesanan (Ambil di Kedai)</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
