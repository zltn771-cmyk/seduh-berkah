'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coffee,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  Coins,
  Smile,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/shared/ProductCard';
import { SimulationBadge } from '@/components/shared/SimulationBadge';
import { formatRupiah } from '@/lib/utils';

export default function HomePage() {
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 3);
  const [cupCount, setCupCount] = useState<number>(2);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ================================================================ */}
      {/* HERO SECTION WITH COZY COFFEE AMBIANCE & MOSQUE SERENITY         */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C0F08] via-[#2A160D] to-[#1F1109] text-[#FAF7F2] py-16 sm:py-24 lg:py-32">
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[550px] h-[550px] bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-emerald-700/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#E8DBCB_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & Calls to Action */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              {/* Pulsing Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Buka di Serambi Masjid Kampus Universitas Bengkulu</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                  Menyeduh Cita Rasa, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent italic font-normal">
                    Menebar Keberkahan.
                  </span>
                </h1>
                <p className="text-base sm:text-lg leading-relaxed text-[#E8DBCB]/90 max-w-2xl mx-auto lg:mx-0 font-normal">
                  Cita rasa asli biji kopi Robusta pilihan petani Kepahiang dan Rejang Lebong. Berkah berkelanjutan melalui akad mudharabah murni dan sedekah produktif untuk civitas akademika.
                </p>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-amber-200/70 uppercase tracking-wider font-semibold">Harga Mahasiswa</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">Rp8.000</span>
                  <span className="text-[10px] text-white/50">Mulai 6 menu pilihan</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-emerald-200/70 uppercase tracking-wider font-semibold">Akad Mudharabah</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-emerald-300 mt-0.5 block">60% : 40%</span>
                  <span className="text-[10px] text-white/50">Laba bersih usaha</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-amber-200/70 uppercase tracking-wider font-semibold">Sedekah Sukarela</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">+Rp1.000</span>
                  <span className="text-[10px] text-white/50">Terpisah mutlak</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-4 text-sm font-bold text-[#2C1810] shadow-lg shadow-amber-900/30 transition-all hover:brightness-105 active:scale-95"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Pesan Kopi (Cash on Pickup)</span>
                </Link>

                <Link
                  href="/pesanan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-white/15 backdrop-blur-md"
                >
                  <span>Cek Antrean Kedai</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Security & Sharia Guarantee Tagline */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-[#E8DBCB]/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Akad Syariah Sah</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>100% Robusta Bengkulu</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Spotlight */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-gradient-to-b from-[#25150C]/90 to-[#180C06]/90 p-6 shadow-2xl backdrop-blur-lg">
                
                {/* Floating Decorative Pill */}
                <div className="absolute -top-3 right-6 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#2D5A43] to-[#1E3F2F] px-3.5 py-1 text-xs font-bold text-white shadow-md border border-white/20">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    Paling Favorit di Kampus
                  </span>
                </div>

                {/* Cup Visual with Subtle Steam */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#381E10] to-[#1F1008] border border-white/10 shadow-inner">
                  <Image
                    src="/images/kopi-susu.svg"
                    alt="Es Kopi Susu Gula Aren Seduh Berkah"
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Subtle Steam Embers */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-16 pointer-events-none">
                    <div className="w-2 h-10 bg-white/20 rounded-full filter blur-xs steam-particle mx-auto" />
                    <div className="w-2 h-8 bg-white/15 rounded-full filter blur-xs steam-particle-delayed mx-auto" />
                  </div>
                </div>

                {/* Product Detail Card */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Es Kopi Susu Gula Aren
                      </h3>
                      <span className="text-xs text-amber-200/70">Robusta Kepahiang • Aren Curup</span>
                    </div>
                    <span className="font-serif text-2xl font-black text-amber-300">
                      Rp13.000
                    </span>
                  </div>

                  <p className="text-xs text-[#E8DBCB]/80 leading-relaxed">
                    Ekstraksi kental Robusta dataran tinggi Kepahiang berpadu gurihnya susu segar dan legitnya gula aren murni Curup yang menenangkan.
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-[#E8DBCB]/70">
                      <span>Sedekah sukarela opsional</span>
                      <strong className="block text-amber-300 font-semibold">+Rp1.000 / porsi</strong>
                    </div>

                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3.5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      <span>Pesan Cangkir Ini</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-300" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4 VALUE PILLARS (FONDASI EKOSISTEM BERKAH)                       */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
              Keberkahan &amp; Kemaslahatan Civitas Akademika
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Empat Fondasi Ekosistem Seduh Berkah
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bukan sekadar kedai kopi komersial, Seduh Berkah dirancang sebagai model percontohan ekonomi syariah dan kepedulian sosial di lingkungan kampus.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-[#E8DBCB]/80 bg-white p-7 shadow-xs card-hover-lift space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2C1810] to-[#402216] text-amber-300 shadow-sm">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                100% Robusta Bengkulu
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Dipasok langsung dari perkebunan dataran tinggi Kepahiang dan Rejang Lebong. Karakter tebal, aroma cokelat alami, dan rendah keasaman.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-[#E8DBCB]/80 bg-white p-7 shadow-xs card-hover-lift space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A43] to-[#1E3F2F] text-emerald-200 shadow-sm">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Akad Mudharabah Murni
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Takmir sebagai Shahibul Maal (pemodal) dan Pengelola sebagai Mudharib. Nisbah 60:40 dihitung dari laba bersih, bukan dari omzet penjualan.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-[#E8DBCB]/80 bg-white p-7 shadow-xs card-hover-lift space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8E5230] to-[#5C321C] text-amber-200 shadow-sm">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Sedekah Terpisah Tegas
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Donasi sukarela Rp1.000/porsi tidak masuk omzet atau laba kedai. Dicatat di pool terisolasi untuk disalurkan ke mahasiswa dhuafa kampus.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border border-[#E8DBCB]/80 bg-white p-7 shadow-xs card-hover-lift space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C77732] to-[#8E5230] text-amber-100 shadow-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Ruang Teduh Masjid UNIB
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Menjadi simpul rehat yang beradab, sarana diskusi ilmiah yang santun, dan silaturahmi produktif bagi mahasiswa dan jamaah masjid.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURED MENU PREVIEW (KATALOG PILIHAN)                         */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#F5EFE6]/60 border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Diracik Segar Oleh Barista Mahasiswa
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] mt-1">
                Menu Unggulan Kedai
              </h2>
            </div>
            
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8DBCB] px-5 py-2.5 text-xs font-bold text-[#8E5230] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
            >
              <span>Jelajahi 6 Menu Lengkap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* INTERACTIVE IMPACT CALCULATOR (KALKULATOR KEBAIKAN CANGKIR KOPI) */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-br from-white to-[#F5EFE6] p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-[#8E5230] px-3 py-1 text-xs font-bold">
                  <Coins className="h-3.5 w-3.5" />
                  Kalkulator Dampak Berkah
                </span>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Setiap Cangkir Menghidupkan Kebaikan
                </h2>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Geser jumlah cangkir untuk melihat estimasi sedekah sukarela dan kontribusi keberkahan yang Anda titipkan bersama kopi favorit Anda:
                </p>

                {/* Interactive Range Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C1810]">
                    <span>Jumlah Cangkir Kopi:</span>
                    <span className="font-serif text-lg text-amber-800">{cupCount} Porsi</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={cupCount}
                    onChange={(e) => setCupCount(parseInt(e.target.value) || 1)}
                    className="w-full accent-[#8E5230] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>1 cangkir</span>
                    <span>5 cangkir</span>
                    <span>10 cangkir</span>
                  </div>
                </div>
              </div>

              {/* Impact Display Card */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-700">Estimasi Sedekah Sukarela:</span>
                    <span className="font-serif text-2xl font-bold text-[#2D5A43]">
                      {formatRupiah(cupCount * 1000)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Membantu paket beasiswa makan siang mahasiswa dhuafa kampus Universitas Bengkulu.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Menyerap hasil panen biji kopi Robusta petani lokal Kepahiang &amp; Rejang Lebong.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Bagi hasil bersih 60% disetorkan langsung ke kas kemakmuran takmir masjid kampus.
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/menu"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2C1810] py-3 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
                    >
                      <span>Pesan Sekarang Melalui Menu</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MUDHARABAH & FINANCIAL GOVERNANCE DETAILS                        */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2">
                <SimulationBadge label="MODEL BISNIS SIMULASI" size="md" />
                <span className="text-xs font-semibold text-[#2D5A43]">Syariah Governance</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] leading-snug">
                Akad Mudharabah &amp; Transparansi Bagi Hasil
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-gray-700">
                Dalam tata kelola Seduh Berkah, Takmir Masjid bertindak sebagai <strong>Shahibul Maal</strong> (pemodal simulasi Rp25.000.000), sementara pengelola bertindak sebagai <strong>Mudharib</strong> (pelaksana operasional kedai).
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Nisbah 60% Takmir : 40% Pengelola</strong> — Dihitung murni setelah dikurangi HPP bahan baku dan biaya tetap operasional Rp4.060.000/bulan (24 hari kerja).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Tanggung Jawab Kerugian</strong> — Sesuai ketentuan syariah mudharabah, kerugian finansial ditanggung oleh pemodal, kecuali terbukti ada kelalaian atau pelanggaran amanah dari pengelola.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Pemisahan Dana Sedekah</strong> — Tidak pernah diakui sebagai keuntungan kedai dan dapat diaudit secara terbuka melalui portal publik.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/transparansi"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2D5A43] px-6 py-3 text-xs font-bold text-white hover:bg-[#20402E] transition-colors shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Buka Portal Transparansi Sedekah</span>
                </Link>
              </div>
            </div>

            {/* Right side simulation card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-[#E8DBCB] bg-[#FAF7F2] p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DBCB]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                      Simulasi Bulanan 50 Porsi / Hari
                    </h3>
                    <span className="text-xs text-gray-500">24 hari kerja operasional (1.200 porsi)</span>
                  </div>
                  <SimulationBadge label="SIMULASI ESSAY" />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-600">Pendapatan Kotor (1.200 × Rp10.150)</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(12180000)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-600">Total HPP Terjual (1.200 × Rp4.215)</span>
                    <span className="font-semibold text-red-700">− {formatRupiah(5058000)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                    <span className="text-gray-600">Biaya Tetap Operasional Kedai</span>
                    <span className="font-semibold text-red-700">− {formatRupiah(4060000)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-amber-100/70 px-3.5 rounded-xl font-bold text-[#2C1810]">
                    <span>Laba Bersih Usaha (Net Profit)</span>
                    <span className="text-sm font-black">{formatRupiah(3062000)}</span>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4">
                    <span className="block text-[11px] font-bold text-emerald-800">
                      Bagian Takmir (60%)
                    </span>
                    <span className="font-serif text-lg font-black text-emerald-950 mt-1 block">
                      {formatRupiah(1837200)}
                    </span>
                    <span className="text-[10px] text-emerald-700">Shahibul Maal</span>
                  </div>

                  <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4">
                    <span className="block text-[11px] font-bold text-amber-800">
                      Bagian Pengelola (40%)
                    </span>
                    <span className="font-serif text-lg font-black text-amber-950 mt-1 block">
                      {formatRupiah(1224800)}
                    </span>
                    <span className="text-[10px] text-amber-700">Mudharib (Operator)</span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#2C1810]/5 p-3 text-[11px] text-gray-700 flex items-center justify-between">
                  <span>Dana Sedekah (Partisipasi 50% = 600 porsi):</span>
                  <strong className="text-[#2C1810] font-black">{formatRupiah(600000)} (Terpisah)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* LOCATION & HOW TO ORDER (CARA PEMESANAN PRAKTIS)                */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DBCB] bg-[#1F1109] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 overflow-hidden relative shadow-xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-5">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Kunjungi Kedai Kami
                </span>
                
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  Serambi Masjid Kampus Universitas Bengkulu
                </h2>
                
                <p className="text-xs sm:text-sm text-[#E8DBCB]/90 leading-relaxed max-w-xl">
                  Kedai buka setiap hari kerja perkuliahan (Senin – Sabtu). Pemesanan melalui platform ini menggunakan sistem <strong>Cash-on-Pickup</strong>: pesan melalui smartphone, ambil kopi hangat atau dingin di kasir tanpa perlu mengantre lama di sela jam kuliah.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-200 font-medium">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>Kompleks Masjid Kampus UNIB, Kandang Limun</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300 font-medium">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Terbuka untuk Mahasiswa, Dosen, &amp; Jamaah</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-4 text-sm font-bold text-[#2C1810] shadow-lg hover:brightness-105 transition-all active:scale-95"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Pesan Sekarang</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
