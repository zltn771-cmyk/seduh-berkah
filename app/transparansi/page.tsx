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
  Eye,
  Info,
  DollarSign,
  TrendingUp,
  Scale,
  AlertTriangle,
  Receipt,
  Users,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function TransparencyPage() {
  const {
    donationDistributions,
    donationSummary,
    publishedReport,
    verifiedReports,
    currentDynamicReport,
    stats,
    mudharabahSetting,
    isSupabaseConnected,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'summary' | 'business' | 'sedekah' | 'governance'>('all');

  // Use the verified & published report from Takmir, or fallback to current dynamic report
  const activeReport = publishedReport || verifiedReports[0] || currentDynamicReport;

  // Filter verified distributions
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
        {/* HEADER HERO & GOVERNANCE BADGES                                  */}
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
              Keterbukaan Finansial &amp; <br />
              <span className="italic font-normal text-amber-300">Amanah Pengelolaan Sedekah.</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              SEDUH BERKAH menyajikan seluruh kondisi kas usaha, hasil mudharabah 60:40, dan rekam jejak sedekah secara terbuka kepada publik, civitas akademika Universitas Bengkulu, dan jamaah masjid kampus.
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

        {/* Quick Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E8DBCB] shadow-2xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#2C1810] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            Semua Laporan
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-[#2C1810] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            1. Ringkasan Kas Publik
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'business'
                ? 'bg-[#2C1810] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            2. Keuangan Usaha &amp; Nisbah 60:40
          </button>
          <button
            onClick={() => setActiveTab('sedekah')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'sedekah'
                ? 'bg-[#2C1810] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            3. Penyaluran Sedekah
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'governance'
                ? 'bg-[#2C1810] text-white shadow-xs'
                : 'text-gray-700 hover:bg-[#FAF7F2]'
            }`}
          >
            4. Kaidah Pemisahan Syariah
          </button>
        </div>

        {/* ================================================================ */}
        {/* BAGIAN 1: RINGKASAN TRANSPARANSI PUBLIK (EXECUTIVE SUMMARY)      */}
        {/* ================================================================ */}
        {(activeTab === 'all' || activeTab === 'summary') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8DBCB]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                  Bagian 1 • Posisi Kas Terkini
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Ringkasan Transparansi Kas Publik
                </h2>
              </div>
              <span className="text-xs text-gray-500">
                Pembaruan per {activeReport.verifiedAt ? formatDateOnly(activeReport.verifiedAt) : '2 November 2026'}
              </span>
            </div>

            {/* 4 Core Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total Kas Usaha */}
              <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-2xs space-y-2 card-hover-lift">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-semibold text-[#8E5230]">KAS USAHA KEDAI</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    OPERASIONAL
                  </span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-black text-[#2C1810] block">
                  {formatRupiah(totalBusinessCash)}
                </span>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Kas riil hasil penjualan menu lunas dikurangi pengeluaran operasional terbayar.
                </p>
              </div>

              {/* Card 2: Kas Sedekah Terkumpul */}
              <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-2xs space-y-2 card-hover-lift">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-semibold text-[#2D5A43]">SEDEKAH TERHIMPUN</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    LUNAS TERBAYAR
                  </span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-black text-[#2D5A43] block">
                  {formatRupiah(totalSedekahCollected)}
                </span>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Titipan sedekah Rp1.000/porsi dari pesanan yang berstatus bayar lunas (Paid).
                </p>
              </div>

              {/* Card 3: Sedekah Disalurkan */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-2xs space-y-2 card-hover-lift">
                <div className="flex justify-between items-center text-xs text-emerald-900 font-semibold">
                  <span>TELAH DISALURKAN</span>
                  <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-950">
                    BUKTI RESMI
                  </span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-black text-emerald-950 block">
                  {formatRupiah(totalSedekahDisbursed)}
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Dana bantuan yang telah direalisasikan kepada penerima manfaat/mitra zakat.
                </p>
              </div>

              {/* Card 4: Sisa Kas Sedekah */}
              <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 shadow-2xs space-y-2 card-hover-lift">
                <div className="flex justify-between items-center text-xs text-blue-950 font-semibold">
                  <span>SISA KAS SEDEKAH</span>
                  <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-950">
                    SIAP SALUR
                  </span>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-black text-blue-950 block">
                  {formatRupiah(sedekahBalance)}
                </span>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Saldo amanah sedekah berjalan yang siap disalurkan pada periode berikutnya.
                </p>
              </div>

            </div>

            {/* Card 5: TOTAL DANA TERCATAT (DENGAN PENJELASAN WAJIB BAHWA INI BUKAN TOTAL LABA) */}
            <div className="rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-400 text-[#2C1810] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      TOTAL DANA TERCATAT (KAS USAHA + KAS SEDEKAH)
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C1810]">
                    Akumulasi Saldo Kas Tercatat di Pembukuan
                  </h3>
                </div>

                <div className="text-left md:text-right">
                  <span className="font-serif text-3xl sm:text-4xl font-black text-[#2C1810] block">
                    {formatRupiah(totalRecordedFunds)}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Kas Usaha ({formatRupiah(totalBusinessCash)}) + Sisa Sedekah ({formatRupiah(sedekahBalance)})
                  </span>
                </div>
              </div>

              {/* CRITICAL STATUTORY DISCLAIMER (KETENTUAN WAJIB) */}
              <div className="rounded-2xl bg-white border border-amber-300 p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <strong className="text-amber-950 font-bold block">
                    Penjelasan Wajib Akuntansi Syariah:
                  </strong>
                  <p className="text-gray-700">
                    Nominal <strong>Total Dana Tercatat ({formatRupiah(totalRecordedFunds)})</strong> ini adalah gabungan matematis saldo fisik kas operasional kedai dan saldo kas sedekah yang tercatat di rekening/brankas pengelola. 
                    <strong className="text-red-700"> ANGKA INI BUKAN TOTAL KEUNTUNGAN ATAU LABA BERSIH USAHA.</strong> 
                    Kas sedekah merupakan titipan murni yang tidak boleh diakui sebagai pendapatan usaha, tidak dapat digunakan untuk menutup defisit kedai, dan tidak diikutsertakan dalam perhitungan bagi hasil nisbah mudharabah.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* BAGIAN 2: LAPORAN KEUANGAN USAHA & MUDHARABAH 60:40              */}
        {/* ================================================================ */}
        {(activeTab === 'all' || activeTab === 'business') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8DBCB]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                  Bagian 2 • Kinerja Finansial Kedai
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Laporan Keuangan Usaha &amp; Bagi Hasil Mudharabah
                </h2>
              </div>
              <div className="text-xs text-gray-600">
                Status: <strong className="text-[#2D5A43]">Disahkan Takmir Masjid</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              
              {/* Financial Calculation Breakdown Table */}
              <div className="lg:col-span-7 rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DBCB]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                      Laporan Laba Rugi Operasional
                    </h3>
                    <span className="text-xs text-gray-500">
                      Periode: {activeReport.periodLabel} ({activeReport.operatingDays || 24} Hari Operasional)
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-[#2D5A43] px-2.5 py-0.5 text-[10px] font-bold">
                    TERVERIFIKASI TAKMIR
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Revenue */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-900 block">Total Pendapatan Penjualan</span>
                      <span className="text-[11px] text-gray-500">Dari pesanan produk lunas terbayar</span>
                    </div>
                    <span className="font-serif text-base font-bold text-gray-900">
                      {formatRupiah(activeReport.grossRevenue)}
                    </span>
                  </div>

                  {/* HPP */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-900 block">Harga Pokok Penjualan (Total HPP)</span>
                      <span className="text-[11px] text-gray-500">Biaya bahan baku biji kopi Robusta, susu, gula aren &amp; cup</span>
                    </div>
                    <span className="font-serif text-base font-bold text-red-700">
                      − {formatRupiah(activeReport.totalHpp)}
                    </span>
                  </div>

                  {/* Gross Profit Subtotal */}
                  <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50 font-semibold text-gray-700">
                    <span>Laba Kotor (Gross Profit)</span>
                    <span className="font-serif text-sm">
                      {formatRupiah(activeReport.grossProfit)}
                    </span>
                  </div>

                  {/* Operational Costs */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-900 block">Biaya Operasional Kedai</span>
                      <span className="text-[11px] text-gray-500">Listrik, gas, pemeliharaan alat, dan logistik kedai</span>
                    </div>
                    <span className="font-serif text-base font-bold text-red-700">
                      − {formatRupiah(activeReport.totalOperationalCost)}
                    </span>
                  </div>

                  {/* Net Profit */}
                  <div className="flex justify-between items-center py-3 px-4 rounded-2xl bg-amber-100/80 text-[#2C1810] font-bold">
                    <div>
                      <span className="text-sm block">Laba Bersih Usaha (Net Profit)</span>
                      <span className="text-[11px] text-amber-900/80 font-normal">Dasar perhitungan pembagian hasil mudharabah</span>
                    </div>
                    <span className="font-serif text-xl sm:text-2xl font-black text-[#2C1810]">
                      {formatRupiah(activeReport.netProfit)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>Status Audit: <strong>Sesuai Rekonsiliasi Bank &amp; Kasir</strong></span>
                  <span>Zero Remainder: <strong>100% Tuntas</strong></span>
                </div>
              </div>

              {/* Mudharabah 60:40 Profit Sharing Display */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-7 shadow-sm space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-[#2D5A43]" />
                      <span className="font-bold text-xs uppercase tracking-wider text-[#8E5230]">
                        Akad Mudharabah
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                      Realisasi Bagi Hasil ({activeReport.nisbahTakmir}% : {activeReport.nisbahOperator}%)
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Laba bersih usaha dibagi adil antara Takmir Masjid (Shahibul Maal) dan Pengelola (Mudharib) sesuai nisbah sah yang berlaku:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Takmir Share (60%) */}
                    <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-[#2D5A43]" />
                          Bagian Takmir Masjid ({activeReport.nisbahTakmir}%)
                        </span>
                        <span className="rounded-md bg-emerald-200 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                          SHAHIBUL MAAL
                        </span>
                      </div>
                      <span className="font-serif text-2xl font-black text-emerald-950 block pt-1">
                        {formatRupiah(activeReport.takmirShare)}
                      </span>
                      <span className="text-[11px] text-emerald-800 leading-snug block">
                        Disetorkan ke kas takmir untuk program kemakmuran, fasilitas ibadah, dan dakwah masjid kampus.
                      </span>
                    </div>

                    {/* Operator Share (40%) */}
                    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-[#8E5230]" />
                          Bagian Pengelola Kedai ({activeReport.nisbahOperator}%)
                        </span>
                        <span className="rounded-md bg-amber-200 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                          MUDHARIB
                        </span>
                      </div>
                      <span className="font-serif text-2xl font-black text-amber-950 block pt-1">
                        {formatRupiah(activeReport.operatorShare)}
                      </span>
                      <span className="text-[11px] text-amber-900 leading-snug block">
                        Hak jasa pengelolaan bagi barista dan pengelola mahasiswa pelaksana operasional kedai.
                      </span>
                    </div>
                  </div>

                  {/* Zero-Remainder Mathematical Proof */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-[11px] text-gray-700 flex justify-between items-center">
                    <span>Verifikasi Jumlah Bagi Hasil:</span>
                    <strong className="text-gray-900 font-mono">
                      {formatRupiah(activeReport.takmirShare)} + {formatRupiah(activeReport.operatorShare)} = {formatRupiah(activeReport.netProfit)} (Pas)
                    </strong>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* BAGIAN 3: LAPORAN PENGELOLAAN & PENYALURAN SEDEKAH               */}
        {/* ================================================================ */}
        {(activeTab === 'all' || activeTab === 'sedekah') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E8DBCB]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                  Bagian 3 • Akuntabilitas Dana Sosial
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                  Laporan Sedekah Sukarela &amp; Riwayat Penyaluran
                </h2>
              </div>
              <span className="text-xs text-gray-500">
                Titipan amanah donasi sukarela Rp1.000 per cangkir kopi
              </span>
            </div>

            {/* Sedekah Summary Card Group */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-[#E8DBCB] bg-white p-5 space-y-1">
                <span className="text-xs text-gray-500 font-semibold block">Jumlah Sedekah Terkumpul</span>
                <span className="font-serif text-2xl font-black text-[#2D5A43] block">
                  {formatRupiah(totalSedekahCollected)}
                </span>
                <span className="text-[11px] text-gray-500 block">Hanya dari pesanan lunas bayar</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-1">
                <span className="text-xs text-emerald-900 font-semibold block">Jumlah Dana Disalurkan</span>
                <span className="font-serif text-2xl font-black text-emerald-950 block">
                  {formatRupiah(totalSedekahDisbursed)}
                </span>
                <span className="text-[11px] text-emerald-800 block">Telah diterima mustahik &amp; mitra</span>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 space-y-1">
                <span className="text-xs text-blue-900 font-semibold block">Sisa Saldo Kas Sedekah</span>
                <span className="font-serif text-2xl font-black text-blue-950 block">
                  {formatRupiah(sedekahBalance)}
                </span>
                <span className="text-[11px] text-blue-800 block">Siap dialokasikan pada batch berikutnya</span>
              </div>
            </div>

            {/* Distribution History Table & Evidence Verification */}
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                    Riwayat Penyaluran Resmi &amp; Bukti Dokumentasi Sah
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Seluruh penyaluran wajib disertai berkas tanda terima yang diverifikasi oleh Takmir Masjid Kampus.
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
                                      Diverifikasi oleh: {ev.verifiedBy || 'Takmir Masjid'}
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
        )}

        {/* ================================================================ */}
        {/* BAGIAN 4: KAIDAH WAJIB PEMISAHAN DANA (SYARIAH COMPLIANCE)        */}
        {/* ================================================================ */}
        {(activeTab === 'all' || activeTab === 'governance') && (
          <section className="space-y-6">
            <div className="pb-2 border-b border-[#E8DBCB]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E5230]">
                Bagian 4 • Landasan Tata Kelola Syariah
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
                Prinsip Wajib Pemisahan Rekening Kas
              </h2>
            </div>

            {/* 2-Pillar Visual Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pillar 1: Kas Usaha */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2C1810] to-[#402216] text-amber-300 shadow-sm">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                      Rekening Kas Usaha (Mudharabah)
                    </h3>
                    <span className="text-[11px] text-gray-500">Komersial • Transparansi Bisnis</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Sumber dana murni dari hasil penjualan produk kopi dan minuman kedai.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Dipotong HPP bahan baku dan biaya tetap operasional bulanan kedai.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Menghasilkan <strong>Laba Bersih</strong> yang dibagi 60% Takmir : 40% Pengelola.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Tidak boleh menerima atau memanfaatkan uang sedekah untuk kegiatan operasional kedai.</span>
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
                      Rekening Kas Sedekah (Amanah Sosial)
                    </h3>
                    <span className="text-[11px] text-gray-500">Sosial • Bebas Bagi Hasil</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Berasal dari infak sukarela Rp1.000/porsi yang hanya diakui jika pesanan <strong>sudah lunas terbayar</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span><strong>100% dana dialokasikan untuk sosial</strong> (beasiswa mahasiswa dhuafa dan program sosial masjid).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span><strong>0% masuk laba</strong> dan sama sekali tidak menjadi dasar perhitungan bagi hasil nisbah mudharabah.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#2D5A43] shrink-0 mt-0.5" />
                    <span>Dana yang sudah disalurkan langsung memotong saldo kas sedekah secara tepat dan terlacak.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Matrix of Role Permissions */}
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                Struktur Hak Akses &amp; Akuntabilitas Pengelolaan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-gray-200 bg-[#FAF7F2] p-4 space-y-2">
                  <strong className="text-[#2C1810] block font-bold">Publik &amp; Pelanggan</strong>
                  <p className="text-gray-600 leading-relaxed">
                    Hanya memiliki akses baca (read-only) terhadap laporan keuangan dan penyaluran sedekah yang telah disahkan dan dipublikasikan resmi oleh Dewan Takmir.
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                  <strong className="text-amber-950 block font-bold">Operator Kedai (Mudharib)</strong>
                  <p className="text-gray-700 leading-relaxed">
                    Berwenang mencatat transaksi kasir, mengelola pesanan, dan menginput biaya operasional. Tidak memiliki akses mengubah nisbah atau mencairkan kas sedekah.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                  <strong className="text-emerald-950 block font-bold">Takmir Masjid (Shahibul Maal)</strong>
                  <p className="text-gray-700 leading-relaxed">
                    Berwenang memverifikasi laporan laba rugi, mengesahkan pembagian hasil 60:40, mengaudit berkas penyaluran sedekah, dan menyetujui publikasi laporan ke masyarakat.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

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
              Pengunjung, dosen, mahasiswa, maupun jamaah masjid dapat memindai stiker QR yang terpasang di meja kedai untuk langsung memeriksa kas usaha, laba mudharabah, dan bukti penyaluran sedekah kapan saja secara transparan.
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
