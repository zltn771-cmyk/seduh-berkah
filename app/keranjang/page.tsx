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
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

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

  const handleCopyOrder = () => {
    if (!createdOrderNumber) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(createdOrderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // If order was just created, show confirmation receipt
  if (createdOrderNumber) {
    return (
      <div className="py-12 sm:py-20 bg-[#FAF7F2] min-h-screen">
        <div className="mx-auto max-w-lg px-4 space-y-6">
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-9 text-center shadow-md relative overflow-hidden">
            {/* Top decorative amber line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-[#8E5230] to-[#2D5A43]" />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-[#2D5A43] mb-4 shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-[#2D5A43] px-3.5 py-1 text-xs font-bold shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Pesanan Terkonfirmasi
            </span>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-3">
              Pesanan Sedang Disiapkan!
            </h1>

            <p className="mt-2 text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              Terima kasih. Silakan simpan nomor pesanan di bawah ini dan lakukan pembayaran tunai saat mengambil cangkir kopi di kasir serambi Masjid UNIB.
            </p>

            {/* Perforated Order Ticket Card */}
            <div className="mt-6 rounded-2xl border-2 border-dashed border-[#8E5230]/40 bg-[#FAF7F2] p-5 text-left space-y-3 relative">
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">Nomor Pesanan</span>
                  <span className="font-mono text-base font-black text-[#8E5230]">
                    {createdOrderNumber}
                  </span>
                </div>
                <button
                  onClick={handleCopyOrder}
                  className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#E8DBCB] px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
                  title="Salin nomor pesanan"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-gray-500" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Nama Pemesan</span>
                <span className="font-bold text-gray-900">{customerName}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Metode Bayar</span>
                <span className="font-bold text-[#8E5230]">Tunai saat Ambil (Cash-on-Pickup)</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Jumlah Minuman</span>
                <span className="font-semibold text-gray-800">{receiptSummary?.portions || 1} Porsi</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Subtotal Minuman</span>
                <span className="font-semibold text-gray-800">{formatRupiah(receiptSummary?.subtotal || 0)}</span>
              </div>

              {receiptSummary && receiptSummary.donation > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
                    Sedekah Sukarela
                  </span>
                  <span className="font-bold">+{formatRupiah(receiptSummary.donation)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs pt-2.5 border-t border-gray-200">
                <span className="text-gray-700 font-bold">Total Pembayaran Kasir</span>
                <span className="font-serif text-lg font-black text-[#2C1810]">
                  {formatRupiah(receiptSummary?.total || 0)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Link
                href="/pesanan"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2C1810] px-5 py-3.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-sm"
              >
                <span>Lihat Status Antrean Pesanan</span>
                <ArrowRight className="h-4 w-4 text-amber-300" />
              </Link>

              <button
                onClick={() => {
                  setCreatedOrderNumber(null);
                  router.push('/menu');
                }}
                className="w-full text-xs font-semibold text-gray-600 hover:text-gray-900 py-2 transition-colors"
              >
                Kembali ke Katalog 6 Menu
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
      <div className="py-24 text-center bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 space-y-5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F6EFE6] text-[#8E5230] shadow-inner">
            <ShoppingBag className="h-10 w-10 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Keranjang Masih Kosong
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              Belum ada cangkir kopi atau minuman yang dipilih. Silakan jelajahi 6 menu andalan Robusta Bengkulu kami.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-[#2C1810] px-7 py-3.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-all shadow-md active:scale-95"
            >
              <Coffee className="h-4 w-4 text-amber-300" />
              <span>Pilih Menu Sekarang</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="pb-6 border-b border-[#E8DBCB] flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Keranjang &amp; Pemesanan Cangkir
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Periksa item pesanan Anda sebelum mengonfirmasi pengambilan di kedai serambi Masjid UNIB.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 underline"
          >
            Kosongkan Keranjang
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-3xl border border-[#E8DBCB] bg-white p-4 sm:p-5 shadow-2xs card-hover-lift"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-18 w-18 shrink-0 rounded-2xl overflow-hidden bg-[#2C1810]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-base font-bold text-[#2C1810]">
                      {product.name}
                    </h3>
                    <span className="text-xs font-bold text-[#8E5230] block">
                      {formatRupiah(product.price)}
                    </span>
                    <span className="block text-[11px] text-gray-500">
                      Subtotal: <strong className="text-gray-800">{formatRupiah(product.price * quantity)}</strong>
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#E8DBCB] bg-[#FAF7F2] p-0.5">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-[#2C1810] rounded-lg hover:bg-white"
                      aria-label="Kurangi porsi"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-[#2C1810]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-gray-600 hover:text-[#2C1810] rounded-lg hover:bg-white"
                      aria-label="Tambah porsi"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* VOLUNTARY DONATION OPT-IN BOX */}
            <div className="rounded-3xl border-2 border-emerald-300/80 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/50 p-6 shadow-xs transition-all">
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  id="sedekah-toggle"
                  checked={isDonationOptIn}
                  onChange={(e) => setIsDonationOptIn(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded-md border-gray-300 text-[#2D5A43] focus:ring-[#2D5A43] accent-[#2D5A43] cursor-pointer"
                />
                <label htmlFor="sedekah-toggle" className="cursor-pointer select-none space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-bold text-[#2D5A43]">
                      Titipkan Sedekah Sukarela (+Rp1.000 / porsi)
                    </span>
                    <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-950">
                      AMANAH SOSIAL
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Sedekah ini <strong>bersifat sukarela</strong> dan <strong>dicatat terpisah mutlak</strong> dari kas usaha kedai. Dana yang terkumpul disalurkan untuk mahasiswa dhuafa dan program sosial masjid kampus via lembaga amil zakat berizin.
                  </p>
                  {isDonationOptIn && (
                    <div className="pt-2 text-xs font-bold text-[#2D5A43] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>Alhamdulillah! Anda bersedekah {formatRupiah(donationInCart)} ({totalPortionsInCart} porsi × Rp1.000)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Form & Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                  Rincian Pembayaran
                </h2>
                <span className="text-[11px] text-gray-500">
                  Pembayaran tunai di kasir saat mengambil pesanan
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs border-y border-[#E8DBCB] py-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Kopi &amp; Menu ({totalPortionsInCart} porsi)</span>
                  <span className="font-bold text-gray-900">{formatRupiah(subtotalInCart)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <HeartHandshake className="h-4 w-4 text-[#2D5A43]" />
                    <span>Sedekah Sukarela (Amanah Titipan)</span>
                  </div>
                  <span className={`font-bold ${isDonationOptIn ? 'text-[#2D5A43]' : 'text-gray-400'}`}>
                    {isDonationOptIn ? formatRupiah(donationInCart) : 'Rp0'}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-dashed border-gray-200 flex justify-between items-baseline font-bold text-[#2C1810]">
                  <span className="text-sm">Total Bayar di Kasir</span>
                  <span className="font-serif text-2xl font-black text-[#2C1810]">
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
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-2 focus:ring-[#8E5230]/20 outline-hidden"
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
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-2 focus:ring-[#8E5230]/20 outline-hidden"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
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
                    placeholder="Contoh: Gula aren dipisah / seduhan panas disajikan ba&apos;da ashar"
                    className="w-full rounded-xl border border-[#E8DBCB] px-3.5 py-2 text-xs text-gray-900 focus:border-[#8E5230] focus:ring-2 focus:ring-[#8E5230]/20 outline-hidden"
                  />
                </div>

                {/* Cash-on-Pickup Note */}
                <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 text-[11px] text-amber-950 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Metode Cash-on-Pickup:</strong> Pesanan langsung dibuat barista. Anda membayar tunai pas di kasir saat mengambil minuman di serambi Masjid Kampus UNIB.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2C1810] to-[#3D2314] py-4 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Memproses Pesanan...</span>
                  ) : (
                    <>
                      <span>Konfirmasi Pesanan (Ambil di Kedai)</span>
                      <ArrowRight className="h-4 w-4 text-amber-300" />
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
