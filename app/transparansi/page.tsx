'use client';

import React, { useState } from 'react';
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
  Info,
  DollarSign,
  AlertTriangle,
  Users,
  Check,
  Coins,
  Wallet,
} from 'lucide-react';

export default function TransparencyPage() {
  const {
    donationDistributions,
    publishedReport,
    verifiedReports,
    currentDynamicReport,
    stats,
    isSupabaseConnected,
  } = useApp();

  // Active verified report metadata
  const activeReport = publishedReport || verifiedReports[0] || currentDynamicReport;

  // Filter public verified distributions
  const publicDistributions = donationDistributions.filter(
    (d) =>
      d.status === 'disbursed' ||
      d.status === 'verified' ||
      d.evidence.some((e) => e.verificationStatus === 'verified')
  );

  // Exact figures from verified operational state
  const totalBusinessCash = stats.totalBusinessCash;
  const totalSedekahCollected = stats.totalSedekahCollected;
  const totalSedekahDisbursed = stats.totalSedekahDisbursed;
  const sedekahBalance = stats.sedekahBalance;
  const totalRecordedFunds = stats.totalRecordedFunds;

  return (
    <div className="py-10 sm:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* ================================================================ */}
        {/* HEADER HERO & GOVERNANCE STATUS                                  */}
        {/* ================================================================ */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-r from-[#1F3D2E] via-[#2A513E] to-[#1C3628] text-white p-7 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs text-emerald-200">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Portal Transparansi Publik SEDUH BERKAH
              </span>

              {isSupabaseConnected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold">
                  DATABASE RESMI AKTIF
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold">
                  DATA TERINTEGRASI SISTEM (SIMULASI OPERASIONAL)
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Transparansi Kas Keuangan &amp; <br />
              <span className="italic font-normal text-amber-300">Pengelolaan Dana Sedekah.</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              Laporan keterbukaan kas operasional kedai kopi dan tata kelola dana sedekah sukarela di lingkungan Masjid Kampus Universitas Bengkulu, diverifikasi dan disahkan oleh Dewan Takmir.
            </p>

            {/* Verification Metadata Cap */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-300" />
                <span>Periode: <strong>{activeReport.periodLabel}</strong></span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Disahkan oleh: <strong>{activeReport.verifiedBy || 'Ketua Dewan Takmir Masjid Kampus UNIB'}</strong></span>
              </div>
              {activeReport.verifiedAt && (
                <>
                  <span>•</span>
                  <span>Diperbarui: {formatDateOnly(activeReport.verifiedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RINGKASAN POSISI KAS UTAMA (A. KAS USAHA, B. SEDEKAH, C. TOTAL)  */}
        {/* ================================================================ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8DBCB]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Ringkasan Transparansi Publik
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                Posisi Kas &amp; Dana Terkelola
              </h2>
            </div>
            <span className="text-xs text-gray-500">
              Pembaruan per {activeReport.verifiedAt ? formatDateOnly(activeReport.verifiedAt) : '2 November 2026'}
            </span>
          </div>

          {/* 3 Main Structured Cards: A, B, C */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* A. KAS KEUANGAN USAHA */}
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 card-hover-lift">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#8E5230] uppercase tracking-wider text-[11px]">
                    <Wallet className="h-4 w-4 text-[#8E5230]" />
                    Kas Keuangan Usaha
                  </span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    KAS OPERASIONAL
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 font-medium block">
                    Saldo Kas Usaha Saat Ini
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-black text-[#2C1810] block mt-1">
                    {formatRupiah(totalBusinessCash)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Saldo kas riil hasil operasional kedai kopi yang berasal dari pesanan penjualan lunas setelah dikurangi pengeluaran beban kedai yang telah dibayar.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Sumber: Penjualan Menu Kedai</span>
                <span className="font-bold text-[#2D5A43]">Terverifikasi Kasir</span>
              </div>
            </div>

            {/* B. KAS SEDEKAH */}
            <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 card-hover-lift">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#2D5A43] uppercase tracking-wider text-[11px]">
                    <HeartHandshake className="h-4 w-4 text-[#2D5A43]" />
                    Kas Sedekah Sukarela
                  </span>
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    AMANAH TERISOLASI
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 font-medium block">
                    Sisa Kas Sedekah (Siap Salur)
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-black text-[#2D5A43] block mt-1">
                    {formatRupiah(sedekahBalance)}
                  </span>
                </div>

                {/* Sub-metrics */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Total Sedekah Terkumpul:</span>
                    <strong className="text-gray-900">{formatRupiah(totalSedekahCollected)}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Total Telah Disalurkan:</span>
                    <strong className="text-emerald-800">{formatRupiah(totalSedekahDisbursed)}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1.5 font-semibold text-gray-800">
                    <span>Sisa Kas Sedekah Berjalan:</span>
                    <span className="text-[#2D5A43] font-bold">{formatRupiah(sedekahBalance)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Titipan: Rp1.000 / Porsi Lunas</span>
                <span className="font-bold text-emerald-800">100% Untuk Sosial</span>
              </div>
            </div>

            {/* C. TOTAL DANA TERCATAT */}
            <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5 card-hover-lift">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#2C1810] uppercase tracking-wider text-[11px]">
                    <Coins className="h-4 w-4 text-amber-700" />
                    Total Dana Tercatat
                  </span>
                  <span className="text-[10px] font-bold text-[#2C1810] bg-amber-200 px-2.5 py-0.5 rounded-full">
                    GABUNGAN KAS
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-500 font-medium block">
                    Penjumlahan Kas Usaha + Sisa Sedekah
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-black text-[#2C1810] block mt-1">
                    {formatRupiah(totalRecordedFunds)}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-amber-200 p-3.5 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Saldo Kas Usaha:</span>
                    <strong className="text-gray-900">{formatRupiah(totalBusinessCash)}</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Sisa Kas Sedekah:</span>
                    <strong className="text-[#2D5A43]">{formatRupiah(sedekahBalance)}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100 font-bold text-gray-900">
                    <span>Total Fisik Kas Tercatat:</span>
                    <span className="text-[#2C1810]">{formatRupiah(totalRecordedFunds)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-snug">
                  Dihitung tanpa penghitungan ganda (non-double counting) antara rekening usaha dan rekening sedekah.
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200/80 text-[11px] text-amber-950 font-semibold text-center">
                Saldo Akuntansi Resmi Terverifikasi
              </div>
            </div>

          </div>

          {/* CRITICAL STATUTORY DISCLAIMER (KETENTUAN WAJIB) */}
          <div className="rounded-3xl bg-amber-50/90 border border-amber-300 p-5 sm:p-6 text-xs text-amber-950 flex items-start gap-3.5 shadow-2xs">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <strong className="text-amber-950 font-bold text-sm block">
                Keterangan Penting Pemisahan Rekening &amp; Kas:
              </strong>
              <p className="text-gray-700 text-xs leading-relaxed">
                Kedua dana di atas (Kas Usaha dan Kas Sedekah) <strong>dicatat secara terpisah mutlak</strong> pada pembukuan SEDUH BERKAH. 
                Nominal <strong>Total Dana Tercatat ({formatRupiah(totalRecordedFunds)})</strong> adalah murni penjumlahan saldo kas operasional kedai dan sisa kas sedekah yang tersimpan. 
                <strong className="text-red-700"> TOTAL INI BUKAN MERUPAKAN LABA ATAU KEUNTUNGAN USAHA.</strong> 
                Dana sedekah adalah amanah titipan sosial dari para pelanggan yang tidak boleh diakui sebagai keuntungan kedai, tidak dapat digunakan untuk menutup biaya operasional, dan tidak menjadi dasar perhitungan bagi hasil.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* LAPORAN RIWAYAT PENYALURAN SEDEKAH & DOKUMENTASI RESMI          */}
        {/* ================================================================ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8DBCB]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Akuntabilitas Dana Sosial
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                Riwayat Penyaluran Sedekah &amp; Bukti Dokumentasi
              </h2>
            </div>
            <span className="text-xs text-gray-500">
              Setiap penyaluran wajib disertai berkas tanda terima sah
            </span>
          </div>

          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                  Program Penyaluran yang Telah Disahkan Takmir
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dokumen dan bukti fisik yang telah diverifikasi keabsahannya oleh Takmir Masjid Kampus UNIB.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-[#2D5A43] px-3 py-1 text-xs font-bold">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Bukti Terverifikasi Sah
              </span>
            </div>

            {publicDistributions.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Belum ada program penyaluran yang telah disahkan Takmir saat ini.
              </div>
            ) : (
              <div className="space-y-5">
                {publicDistributions.map((dist) => (
                  <div
                    key={dist.id}
                    className="rounded-2xl border border-emerald-200/90 bg-[#FDFBF7] p-5 sm:p-6 space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#8E5230]">
                            {dist.distributionCode}
                          </span>
                          <span className="rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 uppercase">
                            TERVERIFIKASI TAKMIR
                          </span>
                        </div>
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2C1810]">
                          {dist.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {dist.description}
                        </p>
                        <div className="text-[11px] text-gray-500 pt-1">
                          Lembaga Mitra Penyalur: <strong className="text-gray-900">{dist.targetInstitution}</strong>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="font-serif text-2xl sm:text-3xl font-black text-[#2D5A43]">
                          {formatRupiah(dist.totalAmount)}
                        </span>
                        <span className="block text-[11px] text-gray-500 mt-1">
                          Tanggal: {dist.distributedAt ? formatDateOnly(dist.distributedAt) : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Evidence Files List */}
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-xs font-semibold text-gray-700 block mb-2">
                        Dokumen Bukti Tanda Terima yang Disahkan:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dist.evidence
                          .filter((e) => e.verificationStatus === 'verified')
                          .map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center justify-between p-3 rounded-xl border border-emerald-300 bg-white shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <FileText className="h-5 w-5 text-[#2D5A43] shrink-0" />
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-xs text-gray-900 block truncate">
                                    {ev.fileName}
                                  </span>
                                  <span className="text-[10px] text-gray-500 block">
                                    Diverifikasi oleh: {ev.verifiedBy || 'Takmir Masjid'} ({ev.verifiedAt || 'Disahkan'})
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-[#2D5A43] flex items-center gap-1 shrink-0 ml-2">
                                <span>Sah</span>
                                <CheckCircle2 className="h-3.5 w-3.5" />
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
        </section>

        {/* ================================================================ */}
        {/* KAIDAH PEMISAHAN REKENING & STRUKTUR HAK AKSES                   */}
        {/* ================================================================ */}
        <section className="space-y-6">
          <div className="pb-2 border-b border-[#E8DBCB]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
              Landasan Tata Kelola Syariah
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Prinsip Pemisahan Dana &amp; Hak Akses
            </h2>
          </div>

          {/* 2-Pillar Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1: Kas Usaha */}
            <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2C1810] to-[#402216] text-amber-300 shadow-sm">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Pilar 1: Rekening Kas Usaha
                  </h3>
                  <span className="text-[11px] text-gray-500">Operasional Kedai Kopi</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>Sumber dana murni dari transaksi penjualan produk kopi dan menu kedai.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>Digunakan untuk membiayai HPP bahan baku dan biaya operasional kedai.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>Dilarang keras menggunakan dana sedekah untuk menambal biaya usaha.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Kas Sedekah */}
            <div className="rounded-3xl border-2 border-emerald-300 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A43] to-[#1E3F2F] text-emerald-200 shadow-sm">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                    Pilar 2: Rekening Kas Sedekah
                  </h3>
                  <span className="text-[11px] text-gray-500">Amanah Sosial Jamaah</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>Titipan sukarela Rp1.000/porsi yang hanya diakui jika pesanan <strong>sudah lunas bayar</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>100% diperuntukkan bagi mahasiswa dhuafa dan program sosial masjid kampus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                  <span>0% masuk laba kedai dan sama sekali tidak diikutsertakan dalam bagi hasil.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Matrix of Role Permissions */}
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#2C1810]">
              Struktur Hak Akses Pengelolaan &amp; Transparansi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl border border-gray-200 bg-[#FAF7F2] p-4 space-y-2">
                <strong className="text-[#2C1810] block font-bold">Publik &amp; Pelanggan</strong>
                <p className="text-gray-600 leading-relaxed">
                  Akses baca (read-only) terhadap laporan posisi kas dan bukti penyaluran sedekah yang telah disahkan oleh Dewan Takmir.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                <strong className="text-amber-950 block font-bold">Operator Kedai (Mudharib)</strong>
                <p className="text-gray-700 leading-relaxed">
                  Berwenang mencatat transaksi kasir dan menginput biaya operasional. Tidak memiliki akses mengubah data sedekah.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <strong className="text-emerald-950 block font-bold">Takmir Masjid (Shahibul Maal)</strong>
                <p className="text-gray-700 leading-relaxed">
                  Berwenang mengaudit pembukuan, mengelola dan memverifikasi bukti penyaluran sedekah, serta mengesahkan publikasi laporan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* QR CODE SCANNER SECTION FOR TABLES & CAMPUS POSTERS             */}
        {/* ================================================================ */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-[#F5EBE1]/70 p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8E5230] uppercase">
              <QrCode className="h-4 w-4" />
              <span>Akses Cepat Meja Kedai</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Pindai QR di Meja Kedai untuk Transparansi
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Pengunjung, dosen, mahasiswa, maupun jamaah masjid dapat memindai stiker QR yang terpasang di meja kedai untuk langsung memeriksa kas usaha, sisa sedekah, dan bukti penyaluran kapan saja secara transparan.
            </p>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2C1810] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-2xs"
              >
                <span>Pesan Kopi &amp; Titip Sedekah Sukarela</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border-2 border-dashed border-[#8E5230] bg-white p-6 text-center shadow-sm space-y-2">
            <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-[#2C1810] text-white mx-auto">
              <QrCode className="h-24 w-24 text-amber-300" />
            </div>
            <span className="block font-mono text-[11px] font-bold text-[#2C1810]">
              SEDUHBERKAH.UNIB.AC.ID
            </span>
            <span className="block text-[10px] text-gray-500">
              Scan untuk audit dana publik
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
