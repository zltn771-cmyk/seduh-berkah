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
  Coins,
  Clock,
  Flame,
  Award,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/shared/ProductCard';
import { formatRupiah } from '@/lib/utils';
import { useApp } from '@/lib/context';

export default function HomePage() {
  const { products, addToCart } = useApp();
  const [cupCount, setCupCount] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter 6 products based on active tab
  const filteredProducts = products.filter((product) => {
    if (activeTab === 'all') return true;
    return product.category === activeTab;
  });

  // Top 3 featured items for hero section showcase
  const signatureItems = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      
      {/* ================================================================ */}
      {/* 1. HERO SECTION: PREMIUM COFFEE BRAND & SERENE CAMPUS AMBIANCE   */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C0F08] via-[#26130A] to-[#1F1109] text-[#FAF7F2] py-16 sm:py-24 lg:py-32">
        {/* Soft Warm Radial Lighting */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[110px] pointer-events-none" />
        
        {/* Fine Coffee Grain Texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8DBCB_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Brand Statement & Primary Action */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              
              {/* Fresh Brew Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Kedai Kopi Serambi Masjid Kampus Universitas Bengkulu</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Kopi Lokal, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent italic font-normal">
                    Teman Setiap Cerita.
                  </span>
                </h1>
                <p className="text-base sm:text-lg leading-relaxed text-[#E8DBCB]/90 max-w-2xl mx-auto lg:mx-0 font-normal">
                  Nikmati racikan kopi Robusta Bengkulu asli lereng Kepahiang &amp; Rejang Lebong dalam setiap tegukan. Hadir hangat, harum, dan terjangkau di lingkungan teduh Masjid Kampus UNIB.
                </p>
              </div>

              {/* 3 Brand Feature Badges */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 pt-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-amber-200/80 uppercase tracking-wider font-semibold">100% Robusta Asli</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">Kepahiang</span>
                  <span className="text-[10px] text-white/50">Profil sangrai pas</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-amber-200/80 uppercase tracking-wider font-semibold">Harga Mahasiswa</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-amber-300 mt-0.5 block">Rp8.000</span>
                  <span className="text-[10px] text-white/50">Mulai 6 menu pilihan</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left backdrop-blur-xs">
                  <span className="block text-[10px] text-emerald-200/80 uppercase tracking-wider font-semibold">Opsi Sedekah</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-emerald-300 mt-0.5 block">+Rp1.000</span>
                  <span className="text-[10px] text-white/50">Sukarela per cangkir</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-4 text-sm font-bold text-[#2C1810] shadow-lg shadow-amber-900/30 transition-all hover:brightness-105 active:scale-95"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Pesan Kopi Sekarang</span>
                </Link>

                <a
                  href="#cerita"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-white/15 backdrop-blur-md"
                >
                  <span>Cerita Kami</span>
                  <ArrowRight className="h-4 w-4 text-amber-300" />
                </a>
              </div>

              {/* Authenticity Assurance */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-[#E8DBCB]/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Diracik Segar Oleh Barista</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Halal &amp; Berkah Bersama</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Spotlight with Real Photography */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-gradient-to-b from-[#25150C]/90 to-[#180C06]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-lg">
                
                {/* Floating Top Badge */}
                <div className="absolute -top-3 right-6 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#8E5230] to-[#5C321C] px-3.5 py-1 text-xs font-bold text-amber-200 shadow-md border border-white/20">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    Signature Terlaris ★
                  </span>
                </div>

                {/* Cup Photography with Realistic Visual */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#170B06] border border-white/10 shadow-inner group">
                  <Image
                    src="/images/kopi-susu.jpg"
                    alt="Es Kopi Susu Gula Aren Seduh Berkah"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest block">
                      Espresso • Fresh Milk • Aren Curup
                    </span>
                  </div>
                </div>

                {/* Product Detail Info */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Es Kopi Susu Gula Aren
                      </h3>
                      <span className="text-xs text-amber-200/70">Robusta Kepahiang • Susu Segar Murni</span>
                    </div>
                    <span className="font-serif text-2xl font-black text-amber-300">
                      Rp13.000
                    </span>
                  </div>

                  <p className="text-xs text-[#E8DBCB]/80 leading-relaxed">
                    Kombinasi mantap espresso Robusta lokal dengan gurihnya susu segar dan legitnya gula aren alami Curup. Disajikan dingin menyegarkan.
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-[#E8DBCB]/70">
                      <span>Metode Pesan</span>
                      <strong className="block text-amber-300 font-semibold">Cash-on-Pickup di Bar</strong>
                    </div>

                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2 text-xs font-bold text-[#2C1810] transition-colors shadow-sm"
                    >
                      <span>Pesan Sekarang</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. SIGNATURE 3 BESTSELLERS WITH EDITORIAL PHOTOGRAPHY           */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#F5EFE6]/60 border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
              Pilihan Favorit Jamaah &amp; Mahasiswa
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Menu Unggulan Kedai
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Tiga racikan paling digemari yang diseduh segar setiap hari untuk menemani waktu istirahat dan diskusi Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {signatureItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#2C1810] px-7 py-3.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-all shadow-md"
            >
              <span>Lihat Semua 6 Menu Lengkap</span>
              <ArrowRight className="h-4 w-4 text-amber-300" />
            </Link>
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. BRAND STORY & PHILOSOPHY ("CERITA KAMI")                     */}
      {/* ================================================================ */}
      <section id="cerita" className="py-16 sm:py-24 bg-white border-b border-[#E8DBCB]/80 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Photography Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="/images/latte-hangat.jpg"
                    alt="Latte Hangat Seduh Berkah"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                    Latte Hangat Menenangkan
                  </div>
                </div>
                <div className="rounded-3xl bg-[#FAF7F2] border border-[#E8DBCB] p-5 space-y-1">
                  <span className="font-serif text-2xl font-black text-[#8E5230]">100%</span>
                  <h4 className="font-bold text-xs text-[#2C1810]">Robusta Asli Bengkulu</h4>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Biji pilihan dari dataran tinggi Kepahiang dan Rejang Lebong.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-3xl bg-[#2C1810] text-[#FAF7F2] p-5 space-y-1">
                  <span className="font-serif text-2xl font-black text-amber-300">Rp8.000</span>
                  <h4 className="font-bold text-xs text-white">Harga Sahabat Kampus</h4>
                  <p className="text-[11px] text-[#E8DBCB]/80 leading-snug">
                    Kenikmatan specialty coffee tanpa menguras kantong mahasiswa.
                  </p>
                </div>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="/images/es-americano.jpg"
                    alt="Es Americano Segar"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold">
                    Es Americano Double Shot
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Editorial Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Cerita Kami
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] leading-snug">
                Dari Lereng Tanah Bengkulu Menuju Secangkir Kebaikan
              </h2>
              
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Bengkulu dianugerahi tanah vulkanik subur di lereng Kepahiang dan Rejang Lebong yang melahirkan biji kopi Robusta istimewa berkarakter tebal, harum, dengan sentuhan rasa cokelat alami. 
              </p>
              
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Di <strong>Seduh Berkah</strong>, kami membawa kekayaan cita rasa lokal tersebut ke serambi Masjid Kampus Universitas Bengkulu. Kami percaya kopi bukan sekadar penghalau kantuk, melainkan teman bertukar pikiran, jeda menenangkan di sela perkuliahan, dan medium menebar kebaikan sosial.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-[#8E5230] shrink-0">
                    <Coffee className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C1810]">Biji Kopi Pilihan Petani Lokal</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Dipetik merah dan dipanggang secara presisi agar menghasilkan seduhan beraroma wangi tanpa keasaman yang menusuk lambung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-[#2D5A43] shrink-0">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C1810]">Secangkir Berkah &amp; Peduli</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Setiap pemesan dapat menitipkan sedekah sukarela Rp1.000/porsi yang dikelola terpisah untuk beasiswa mahasiswa dhuafa kampus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-800 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C1810]">Ruang Santun &amp; Teduh Kampus</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Menghadirkan suasana tenang di serambi masjid untuk membaca, mengerjakan tugas, dan bersilaturahmi dengan nyaman.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. FULL 6-MENU CATALOG WITH TABS & REAL PHOTOGRAPHY            */}
      {/* ================================================================ */}
      <section id="menu" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DBCB]/80 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Daftar Lengkap Citarasa
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] mt-1">
                Koleksi 6 Menu Seduh Berkah
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EFE6]'
                }`}
              >
                Semua Menu ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('kopi-robusta')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'kopi-robusta'
                    ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EFE6]'
                }`}
              >
                Kopi Robusta
              </button>
              <button
                onClick={() => setActiveTab('non-kopi')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'non-kopi'
                    ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EFE6]'
                }`}
              >
                Non-Kopi
              </button>
              <button
                onClick={() => setActiveTab('teh')}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'teh'
                    ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                    : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EFE6]'
                }`}
              >
                Teh Segar
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. INTERACTIVE CHARITY CALCULATOR (KALKULATOR KEBAIKAN CANGKIR)  */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8DBCB]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-[#2D5A43] px-3.5 py-1 text-xs font-bold">
                  <Coins className="h-3.5 w-3.5" />
                  Kalkulator Kebaikan Cangkir
                </span>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Secangkir Kopi, Beribu Senyum
                </h2>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Geser jumlah cangkir untuk melihat akumulasi sedekah sukarela yang Anda titipkan bersama pesanan kopi favorit Anda:
                </p>

                {/* Range Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2C1810]">
                    <span>Jumlah Cangkir Kopi:</span>
                    <span className="font-serif text-lg text-[#8E5230]">{cupCount} Porsi</span>
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

              {/* Impact Summary Box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-700">Akumulasi Sedekah Sukarela:</span>
                    <span className="font-serif text-2xl font-black text-[#2D5A43]">
                      {formatRupiah(cupCount * 1000)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Membantu subsidi makan siang mahasiswa dhuafa kampus Universitas Bengkulu.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Mendukung hasil panen berkelanjutan petani kopi Robusta Kepahiang &amp; Rejang Lebong.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                      <span>
                        Dicatat transparan dan disalurkan melalui lembaga amil zakat berizin resmi.
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/menu"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2C1810] py-3.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-sm"
                    >
                      <span>Pesan Sekarang &amp; Titipkan Sedekah</span>
                      <ArrowRight className="h-4 w-4 text-amber-300" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. HOW TO ORDER & LOCATION (CASH ON PICKUP)                      */}
      {/* ================================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-[#3E2316] bg-[#1F1109] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 overflow-hidden relative shadow-xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Cara Pemesanan Praktis
                </span>
                
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Pesan Daring, Ambil Segar di Serambi Masjid UNIB
                </h2>
                
                <p className="text-xs sm:text-sm text-[#E8DBCB]/90 leading-relaxed max-w-xl">
                  Kedai buka setiap hari perkuliahan (Senin – Sabtu, 09.00 – 17.00 WIB). Menggunakan sistem <strong>Cash-on-Pickup</strong> yang praktis tanpa repot mengantre:
                </p>

                {/* 3 Step Workflow */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1.5 backdrop-blur-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-[#2C1810]">
                      1
                    </span>
                    <strong className="block text-white text-xs">Pilih Menu</strong>
                    <span className="text-[#E8DBCB]/70 text-[11px] block">
                      Tentukan cangkir kopi &amp; opsi sedekah sukarela.
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1.5 backdrop-blur-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-[#2C1810]">
                      2
                    </span>
                    <strong className="block text-white text-xs">Barista Meracik</strong>
                    <span className="text-[#E8DBCB]/70 text-[11px] block">
                      Pantau nomor antrean langsung dari smartphone.
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1.5 backdrop-blur-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-[#2C1810]">
                      3
                    </span>
                    <strong className="block text-white text-xs">Ambil &amp; Bayar</strong>
                    <span className="text-[#E8DBCB]/70 text-[11px] block">
                      Bayar tunai di kasir saat mengambil minuman.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-200 font-medium">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>Kompleks Masjid Kampus UNIB, Jl. WR. Supratman, Kandang Limun</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex lg:justify-end">
                <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md space-y-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-[#2C1810] mx-auto shadow-md">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Siap Menikmati Kopi?
                    </h3>
                    <p className="text-xs text-[#E8DBCB]/80 mt-1">
                      Racikan segar biji Robusta Bengkulu siap disajikan untuk Anda hari ini.
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-xs font-bold text-[#2C1810] shadow-lg hover:brightness-105 transition-all"
                  >
                    <span>Buka Menu &amp; Pesan</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
