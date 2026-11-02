import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#3E2316] bg-[#1C0F08] text-[#FDFBF7]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Col 1: Brand & Filosofi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-[#2C1810] shadow-sm">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-black tracking-tight text-white block">
                  SEDUH BERKAH
                </span>
                <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider block">
                  Specialty Robusta Bengkulu
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#E8DBCB]/80">
              Kedai kopi Robusta asli Bengkulu yang menghadirkan kenikmatan seduhan hangat dan dingin dengan harga ramah mahasiswa di lingkungan Masjid Kampus Universitas Bengkulu.
            </p>
            <div className="pt-1 text-[11px] text-[#E8DBCB]/60 italic">
              &quot;Kopi lokal berpadu keberkahan sosial, menemani setiap langkah civitas akademika.&quot;
            </div>
          </div>

          {/* Col 2: Nilai & Komitmen Kedai */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-amber-300 uppercase">
              Nilai &amp; Komitmen
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DBCB]/85">
              <li className="flex items-start gap-2.5">
                <Coffee className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  <strong>100% Robusta Bengkulu:</strong> Dipasok langsung dari perkebunan lereng Kepahiang &amp; Rejang Lebong.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  <strong>Bagi Hasil Adil:</strong> Dikelola bersama takmir masjid untuk kemaslahatan bersama civitas kampus.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <HeartHandshake className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  <strong>Sedekah Sukarela:</strong> Opsi infak Rp1.000/porsi yang dikelola terpisah untuk beasiswa mahasiswa dhuafa.
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Lokasi & Jam Operasional */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-amber-300 uppercase">
              Kunjungi Kedai
            </h4>
            <div className="space-y-3 text-xs text-[#E8DBCB]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <span>
                  Serambi Masjid Kampus Universitas Bengkulu, Jl. WR. Supratman, Kandang Limun, Kota Bengkulu.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-amber-300 mt-0.5" />
                <div>
                  <strong>Senin – Sabtu</strong>
                  <span className="block text-[#E8DBCB]/70">09.00 – 17.00 WIB</span>
                  <span className="block text-[11px] text-amber-200/80 mt-0.5">
                    *Istirahat saat waktu shalat berjamaah
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Tautan Cepat & Akses Pengelola */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider text-amber-300 uppercase">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-[#E8DBCB]/80">
              <li>
                <Link href="/menu" className="hover:text-amber-300 transition-colors">
                  Daftar 6 Menu Minuman
                </Link>
              </li>
              <li>
                <Link href="/pesanan" className="hover:text-amber-300 transition-colors">
                  Status Antrean Pesanan
                </Link>
              </li>
              <li>
                <Link href="/transparansi" className="hover:text-amber-300 transition-colors">
                  Transparansi Dana Sedekah
                </Link>
              </li>
              <li className="pt-2 border-t border-[#3E2316]/80 text-[#E8DBCB]/50 text-[11px]">
                Akses Internal Pengelola:
              </li>
              <li>
                <Link href="/operator" className="text-amber-300/80 hover:text-amber-300 transition-colors">
                  → Masuk Panel Kasir / Operator
                </Link>
              </li>
              <li>
                <Link href="/takmir" className="text-emerald-300/80 hover:text-emerald-300 transition-colors">
                  → Masuk Panel Audit Takmir
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#2F1A0F] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#E8DBCB]/60">
          <p>© 2026 SEDUH BERKAH — Kopi Robusta Bengkulu &amp; Masjid Kampus UNIB.</p>
          <p className="text-[11px] text-center sm:text-right">
            Penyaluran sedekah dikelola secara amanah untuk mahasiswa kampus.
          </p>
        </div>
      </div>
    </footer>
  );
}
