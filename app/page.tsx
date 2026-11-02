import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Coffee,
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Coins,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/shared/ProductCard';
import { SimulationBadge } from '@/components/shared/SimulationBadge';
import { formatRupiah } from '@/lib/utils';

export default function HomePage() {
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2C1810] via-[#3E2316] to-[#2C1810] text-[#FDFBF7] py-16 sm:py-24 lg:py-28">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8DBCB_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kedai Kopi Robusta Asli Bengkulu di Masjid Kampus UNIB</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Menyeduh Cita Rasa, <br className="hidden sm:inline" />
                <span className="text-amber-300 italic">Menebar Keberkahan.</span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[#E8DBCB]/90 max-w-2xl mx-auto lg:mx-0">
                Nikmati seduhan biji kopi Robusta pilihan petani Bengkulu dengan harga ramah mahasiswa. Berkelanjutan melalui kemitraan akad mudharabah murni dan transparansi sedekah sukarela.
              </p>

              {/* Price Highlights Pill */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left">
                  <span className="block text-[11px] text-[#E8DBCB]/70">Menu Mulai</span>
                  <span className="font-serif text-lg font-bold text-amber-300">Rp8.000</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left">
                  <span className="block text-[11px] text-[#E8DBCB]/70">Akad Mudharabah</span>
                  <span className="font-serif text-lg font-bold text-emerald-300">60% : 40%</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-left">
                  <span className="block text-[11px] text-[#E8DBCB]/70">Sedekah Sukarela</span>
                  <span className="font-serif text-lg font-bold text-amber-300">Rp1.000 / porsi</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-[#2C1810] shadow-md transition-all hover:bg-amber-300 active:scale-95"
                >
                  <Coffee className="h-4 w-4" />
                  <span>Lihat Katalog 6 Menu</span>
                </Link>

                <Link
                  href="/pesanan"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#E8DBCB]/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#FDFBF7] transition-all hover:bg-white/10"
                >
                  <span>Cek Status Antrean</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl border border-white/10 bg-[#1F1109]/80 p-6 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#2C1810] border border-white/10">
                  <Image
                    src="/images/kopi-susu.svg"
                    alt="Es Kopi Susu Gula Aren Seduh Berkah"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-[#2D5A43] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Favorit Jamaah
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-white">
                      Es Kopi Susu Gula Aren
                    </h3>
                    <span className="font-serif text-lg font-bold text-amber-300">
                      Rp13.000
                    </span>
                  </div>
                  <p className="text-xs text-[#E8DBCB]/80 leading-relaxed">
                    Robusta Kepahiang diekstrak presisi, berpadu susu segar dan gula aren murni Curup yang legit dan menenangkan.
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#E8DBCB]/70">
                    <span>Sedekah sukarela opsional</span>
                    <span className="font-semibold text-amber-300">+Rp1.000 / porsi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 VALUE PILLARS SECTION */}
      <section className="py-14 sm:py-20 bg-[#FDFBF7] border-b border-[#E8DBCB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Empat Fondasi Ekosistem Seduh Berkah
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bukan sekadar kedai kopi biasa, Seduh Berkah dirancang sebagai simpul pemberdayaan ekonomi syariah dan kepedulian sosial kampus.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-[#E8DBCB] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C1810] text-amber-300 mb-4">
                <Coffee className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">100% Robusta Bengkulu</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Dipasok langsung dari perkebunan dataran tinggi Kepahiang dan Rejang Lebong. Karakter tebal, aroma cokelat alami, dan rendah keasaman.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-[#E8DBCB] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2D5A43] text-emerald-200 mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">Akad Mudharabah Sah</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Takmir sebagai Shahibul Maal (pemodal) dan Pengelola sebagai Mudharib. Nisbah 60:40 dihitung dari laba bersih, bukan dari omzet penjualan.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-[#E8DBCB] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8E5230] text-amber-200 mb-4">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">Sedekah Terpisah Tegas</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Donasi sukarela Rp1.000/porsi tidak masuk omzet atau laba kedai. Dicatat di pool terisolasi untuk disalurkan via lembaga amil zakat berizin.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl border border-[#E8DBCB] bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-amber-100 mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">Lingkungan Masjid UNIB</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Menjadi ruang rehat yang teduh, diskusi ilmiah yang beradab, dan silaturahmi produktif bagi mahasiswa, dosen, serta jamaah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MENU PREVIEW */}
      <section className="py-14 sm:py-20 bg-[#F5EBE1]/40 border-b border-[#E8DBCB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Pilihan Paling Digemari
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
                Menu Unggulan Kedai
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8E5230] hover:text-[#2C1810] transition-colors"
            >
              <span>Lihat Semua 6 Menu Lengkap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENT MUDHARABAH & SIMULATION SECTION */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8DBCB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left side text */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2">
                <SimulationBadge label="MODEL BISNIS SIMULASI" size="md" />
                <span className="text-xs font-semibold text-[#2D5A43]">Syariah Governance</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C1810] leading-snug">
                Akad Mudharabah &amp; Transparansi Bagi Hasil
              </h2>

              <p className="text-sm leading-relaxed text-gray-700">
                Dalam operasional Seduh Berkah, Takmir Masjid bertindak sebagai <strong>Shahibul Maal</strong> (pemilik modal simulasi Rp25.000.000), sementara pengelola bertindak sebagai <strong>Mudharib</strong> (pelaksana operasional usaha).
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Nisbah 60% Takmir : 40% Pengelola</strong> — Dihitung murni setelah dikurangi HPP bahan baku dan biaya tetap operasional Rp4.060.000/bulan (24 hari operasional).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Tanggung Jawab Kerugian</strong> — Sesuai kaidah syariah mudharabah, kerugian finansial ditanggung oleh pemodal, kecuali terbukti ada kelalaian atau pelanggaran amanah dari pengelola.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <strong>Dana Sedekah Amanah</strong> — Tidak pernah diakui sebagai keuntungan kedai. Transparansi penyaluran dapat diaudit langsung melalui portal publik.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/transparansi"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2D5A43] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#20402E] transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Buka Portal Transparansi Sedekah</span>
                </Link>
              </div>
            </div>

            {/* Right side simulation card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E8DBCB] bg-[#FDFBF7] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DBCB]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                      Simulasi Bulanan 50 Porsi / Hari
                    </h3>
                    <span className="text-xs text-gray-500">24 hari kerja operasional (1.200 porsi)</span>
                  </div>
                  <SimulationBadge label="SIMULASI ESSAY" />
                </div>

                <div className="mt-6 space-y-3 text-xs">
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
                  <div className="flex justify-between py-2.5 bg-amber-100/60 px-3 rounded-lg font-bold text-[#2C1810]">
                    <span>Laba Bersih Usaha (Net Profit)</span>
                    <span className="text-sm">{formatRupiah(3062000)}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8DBCB] grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                    <span className="block text-[11px] font-medium text-emerald-800">
                      Bagian Takmir (60%)
                    </span>
                    <span className="font-serif text-base font-bold text-emerald-900 mt-1 block">
                      {formatRupiah(1837200)}
                    </span>
                    <span className="text-[10px] text-emerald-700">Shahibul Maal</span>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                    <span className="block text-[11px] font-medium text-amber-800">
                      Bagian Pengelola (40%)
                    </span>
                    <span className="font-serif text-base font-bold text-amber-900 mt-1 block">
                      {formatRupiah(1224800)}
                    </span>
                    <span className="text-[10px] text-amber-700">Mudharib (Operator)</span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-[#2C1810]/5 p-3 text-[11px] text-gray-600 flex items-center justify-between">
                  <span>Dana Sedekah (Partisipasi 50% = 600 porsi):</span>
                  <strong className="text-[#2C1810]">{formatRupiah(600000)} (Terpisah Murni)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & VISITOR GUIDE */}
      <section className="py-14 sm:py-20 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#E8DBCB] bg-[#2C1810] text-[#FDFBF7] p-8 sm:p-12 overflow-hidden relative">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Kunjungi Kedai Kami
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Serambi Masjid Kampus Universitas Bengkulu
                </h2>
                <p className="text-xs sm:text-sm text-[#E8DBCB]/90 leading-relaxed max-w-xl">
                  Kedai buka setiap hari kerja perkuliahan (Senin – Sabtu). Pemesanan melalui platform ini menggunakan sistem <strong>Cash-on-Pickup</strong>: pesan secara daring, ambil dan bayar tunai di kasir tanpa perlu mengantre lama.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-200">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>Kompleks Masjid Kampus UNIB, Kandang Limun</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Users className="h-4 w-4 shrink-0" />
                    <span>Terbuka untuk Mahasiswa, Dosen, &amp; Jamaah</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-sm font-bold text-[#2C1810] shadow-lg hover:bg-amber-300 transition-all active:scale-95"
                >
                  <Coffee className="h-5 w-5" />
                  <span>Pesan Sekarang (Ambil di Kasir)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
