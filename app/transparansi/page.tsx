'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context';
import { formatRupiah, formatDateOnly } from '@/lib/utils';
import {
  HeartHandshake,
  ShieldCheck,
  QrCode,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Eye,
  Info,
} from 'lucide-react';

export default function TransparencyPage() {
  const { donationDistributions, donationSummary } = useApp();

  // Public Transparency Filter: Only display distributions that have verified status or verified evidence
  const publicDistributions = donationDistributions.filter(
    (d) =>
      d.status === 'disbursed' ||
      d.status === 'verified' ||
      d.evidence.some((e) => e.verificationStatus === 'verified')
  );

  return (
    <div className="py-10 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-r from-[#2D5A43] via-[#244b37] to-[#1a3828] text-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Portal Transparansi Publik Amanah Sedekah</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Setiap Rupiah Sedekah Anda Terlacak, Terpisah &amp; Berkah.
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Sedekah sukarela Rp1.000 per porsi yang Anda titipkan saat memesan kopi dicatat pada rekening/pool terpisah dari kas operasional kedai. Dana ini 100% diperuntukkan bagi kemaslahatan jamaah dan mahasiswa dhuafa kampus, diverifikasi langsung oleh Takmir Masjid Kampus Universitas Bengkulu.
            </p>
          </div>
        </div>

        {/* 3 Real-time Validated Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Collected */}
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-medium">Total Sedekah Terhimpun</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                TERVERIFIKASI BAYAR
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-[#2C1810] block">
              {formatRupiah(donationSummary.totalReceived)}
            </span>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Akumulasi sedekah sukarela pelanggan dari pesanan yang telah lunas (Paid) dan berstatus selesai.
            </p>
          </div>

          {/* Total Disbursed */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs text-emerald-800 font-semibold">
              <span>Telah Disalurkan Resmi</span>
              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                BUKTI TERVERIFIKASI
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-emerald-950 block">
              {formatRupiah(donationSummary.totalDisbursed)}
            </span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Disalurkan melalui program santunan mahasiswa dhuafa dan dakwah dengan bukti tanda terima sah.
            </p>
          </div>

          {/* Balance Available */}
          <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs text-blue-950 font-semibold">
              <span>Saldo Amanah Berjalan</span>
              <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                SIAP SALUR
              </span>
            </div>
            <span className="font-serif text-3xl font-bold text-blue-950 block">
              {formatRupiah(donationSummary.balanceAvailable)}
            </span>
            <p className="text-[11px] text-blue-900 leading-relaxed">
              Tersimpan aman di kas khusus takmir masjid menunggu alokasi batch penyaluran berikutnya.
            </p>
          </div>
        </div>

        {/* Sharia Guarantee & Privacy Shield Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#2D5A43] shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 block font-serif text-sm">
                Jaminan Pemisahan Syariah 100%
              </strong>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                Dana sedekah tidak pernah dicampur dengan omzet usaha kedai, tidak dikenakan bagi hasil nisbah mudharabah, dan tidak digunakan untuk menambal kerugian operasional kedai kopi.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DBCB] bg-white p-4 text-xs text-gray-800 flex items-start gap-3">
            <Lock className="h-5 w-5 text-[#8E5230] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#2C1810] block font-serif text-sm">
                Perlindungan Privasi Donatur (Jamaah)
              </strong>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Nomor kontak WhatsApp, nomor telepon, dan data pribadi pelanggan yang bersedekah dijaga kerahasiaannya dan tidak pernah dipublikasikan di portal umum ini.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Evidence & Distributions Section */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
                Rekam Jejak Program Penyaluran &amp; Berkas Bukti Sah
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Dokumen resmi yang telah diperiksa dan disahkan oleh Takmir Masjid Kampus Universitas Bengkulu.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-[#2D5A43] px-3 py-1 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Dokumen Terverifikasi
            </span>
          </div>

          {publicDistributions.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              Belum ada program penyaluran yang telah disahkan Takmir saat ini.
            </div>
          ) : (
            <div className="space-y-6">
              {publicDistributions.map((dist) => (
                <div
                  key={dist.id}
                  className="rounded-2xl border border-emerald-200/90 bg-[#FDFBF7] p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8E5230]">
                          {dist.distributionCode}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 uppercase">
                          TERVERIFIKASI TAKMIR
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        {dist.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                        {dist.description}
                      </p>
                      <div className="text-[11px] text-gray-500 pt-1">
                        Mitra Lembaga Penyalur: <strong className="text-gray-900">{dist.targetInstitution}</strong>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2D5A43]">
                        {formatRupiah(dist.totalAmount)}
                      </span>
                      <span className="block text-[11px] text-gray-500 mt-1">
                        Tanggal: {dist.distributedAt ? formatDateOnly(dist.distributedAt) : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Evidence Attachments (Only Verified by Takmir) */}
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-700 block mb-2.5">
                      Berkas Bukti Resmi yang Disahkan Takmir:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dist.evidence
                        .filter((e) => e.verificationStatus === 'verified')
                        .map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-white shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <FileText className="h-5 w-5 text-[#2D5A43] shrink-0" />
                              <div className="space-y-0.5">
                                <span className="font-semibold text-xs text-gray-900 block truncate">
                                  {ev.fileName}
                                </span>
                                <span className="text-[10px] text-gray-500 block">
                                  Diverifikasi: {ev.verifiedBy || 'Takmir Masjid'} ({ev.verifiedAt || 'Terverifikasi'})
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-[#2D5A43] flex items-center gap-1 shrink-0 ml-2">
                              <span>Sah</span>
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Code Section for Tabletop / Storefront Scanning */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-[#F5EBE1]/70 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8E5230] uppercase">
              <QrCode className="h-4 w-4" />
              <span>Akses Cepat Pengunjung Serambi Masjid</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Pindai QR di Meja Kedai untuk Transparansi
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Pengunjung, dosen, mahasiswa, maupun jamaah masjid dapat memindai stiker QR yang terpasang di setiap meja kedai untuk langsung memeriksa saldo terkumpul dan bukti penyaluran sedekah kapan saja secara transparan.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2C1810] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
              >
                <span>Pesan Kopi &amp; Titip Sedekah Sukarela</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* QR Code Graphic Box */}
          <div className="shrink-0 rounded-2xl border-2 border-dashed border-[#8E5230] bg-white p-6 text-center shadow-sm space-y-2">
            <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-[#2C1810] text-white mx-auto">
              <QrCode className="h-24 w-24 text-amber-300" />
            </div>
            <span className="block font-mono text-[11px] font-bold text-[#2C1810]">
              SEDUHBERKAH.UNIB.AC.ID
            </span>
            <span className="block text-[10px] text-gray-500">
              Scan untuk audit dana sedekah
            </span>
          </div>
        </div>

        {/* Institutional Mechanism Disclaimer Note */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Catatan Kebijakan Transparansi Syariah:</strong> Penyaluran dana sedekah dirancang melalui lembaga amil zakat berizin resmi atau kepanitiaan sosial kemakmuran masjid kampus. Sebelum penandatanganan kesepakatan mitra definitif, penyaluran dicantumkan sebagai mekanisme perancangan dan seluruh data di atas berstatus simulasi amanah.
          </div>
        </div>

      </div>
    </div>
  );
}
