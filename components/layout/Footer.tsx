import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Clock, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';
import { SimulationBadge } from '@/components/shared/SimulationBadge';

export function Footer() {
  return (
    <footer className="border-t border-[#E8DBCB] bg-[#2C1810] text-[#FDFBF7]">
      {/* Simulation Banner Notice */}
      <div className="border-b border-[#3E2316] bg-[#1F1109] px-4 py-3 text-center text-xs text-[#E8DBCB]/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
          <SimulationBadge label="PROTOTIPE FRONTEND PHASE 3" size="sm" />
          <span>
            Seluruh data transaksi, mutasi keuangan, dan laporan bagi hasil pada platform ini adalah{' '}
            <strong className="text-amber-300">DATA SIMULASI</strong> berdasarkan rancangan essay bisnis mudharabah.
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Filosofi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-[#2C1810]">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                SEDUH BERKAH
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#E8DBCB]/80">
              Platform ekosistem kedai kopi Robusta asli Bengkulu berlandaskan akad mudharabah murni dan sedekah produktif di lingkungan Masjid Kampus Universitas Bengkulu.
            </p>
            <div className="pt-2 text-[11px] text-[#E8DBCB]/60">
              Menghubungkan kenikmatan cita rasa lokal dengan keberkahan sosial civitas akademika.
            </div>
          </div>

          {/* Col 2: Landasan Akad & Sedekah */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-amber-300 uppercase">
              Prinsip Bisnis Syariah
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCB]/80">
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  <strong>Akad Mudharabah:</strong> Takmir sebagai Shahibul Maal (pemodal) &amp; Pengelola sebagai Mudharib (pelaksana).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HeartHandshake className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  <strong>Nisbah 60:40:</strong> Bagi hasil dihitung mutlak dari laba bersih, bukan dari omzet penjualan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-amber-200 mt-0.5" />
                <span>
                  <strong>Sedekah Sukarela:</strong> Rp1.000/porsi dipisahkan tegas dari kas usaha dan tidak masuk perhitungan nisbah.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Operasional & Lokasi */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-amber-300 uppercase">
              Lokasi &amp; Waktu
            </h4>
            <div className="space-y-2.5 text-xs text-[#E8DBCB]/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  Lingkungan Masjid Kampus Universitas Bengkulu, Jl. WR. Supratman, Kandang Limun, Kota Bengkulu.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  Operasional: 24 hari kerja per bulan (Senin – Sabtu, menyesuaikan jadwal kegiatan kampus &amp; waktu shalat).
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-amber-300 uppercase">
              Akses Cepat
            </h4>
            <ul className="space-y-2 text-xs text-[#E8DBCB]/80">
              <li>
                <Link href="/menu" className="hover:text-amber-300 transition-colors">
                  Katalog 6 Menu Robusta
                </Link>
              </li>
              <li>
                <Link href="/pesanan" className="hover:text-amber-300 transition-colors">
                  Pelacakan Status Pesanan Antrean
                </Link>
              </li>
              <li>
                <Link href="/transparansi" className="hover:text-amber-300 transition-colors">
                  Portal Transparansi Dana Sedekah
                </Link>
              </li>
              <li>
                <Link href="/operator" className="hover:text-amber-300 transition-colors">
                  Panel Kasir / Barista (Mudharib)
                </Link>
              </li>
              <li>
                <Link href="/takmir" className="hover:text-amber-300 transition-colors">
                  Panel Pengawasan Takmir (Shahibul Maal)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#3E2316] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E8DBCB]/60">
          <p>© 2026 SEDUH BERKAH — Kopi Robusta Bengkulu &amp; Ekosistem Masjid Kampus UNIB.</p>
          <p className="text-[11px]">
            Penyaluran sedekah dirancang melalui lembaga amil zakat berizin resmi.
          </p>
        </div>
      </div>
    </footer>
  );
}
