'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { formatRupiah, formatDateOnly } from '@/lib/utils';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  FileCheck2,
  Settings,
  AlertOctagon,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  Printer,
  Calendar,
  AlertTriangle,
  History,
  Lock,
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PeriodFilter } from '@/services/financial.service';

export default function TakmirDashboardPage() {
  const {
    mudharabahSetting,
    updateNisbah,
    nisbahHistory,
    currentDynamicReport,
    verifiedReports,
    submitCurrentReport,
    verifyCurrentReport,
    rejectCurrentReport,
    periodFilter,
    setPeriodFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    donationDistributions,
    donationSummary,
    updateEvidenceStatus,
    addDonationDistribution,
    auditLogs,
    stats,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'laporan_tersimpan' | 'sedekah' | 'nisbah' | 'audit'>('ringkasan');

  // Nisbah Form State
  const [takmirRatio, setTakmirRatio] = useState<number>(mudharabahSetting.shahibulMaalRatio);
  const [operatorRatio, setOperatorRatio] = useState<number>(mudharabahSetting.mudharibRatio);
  const [nisbahReason, setNisbahReason] = useState<string>('');

  // Synchronize state when setting changes
  useEffect(() => {
    setTakmirRatio(mudharabahSetting.shahibulMaalRatio);
    setOperatorRatio(mudharabahSetting.mudharibRatio);
  }, [mudharabahSetting]);

  // Sedekah Distribution Form State
  const [distTitle, setDistTitle] = useState('');
  const [distDescription, setDistDescription] = useState('Penyaluran sedekah sukarela pelanggan kedai kopi Seduh Berkah.');
  const [distAmount, setDistAmount] = useState<number>(100000);
  const [distInstitution, setDistInstitution] = useState('Lembaga Amil Zakat Berizin Mitra Kampus');
  const [distFormError, setDistFormError] = useState<string | null>(null);
  const [distFormSuccess, setDistFormSuccess] = useState<string | null>(null);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Selected locked report details modal
  const [selectedLockedReportId, setSelectedLockedReportId] = useState<string | null>(null);

  const handleSaveNisbah = (e: React.FormEvent) => {
    e.preventDefault();
    if (takmirRatio + operatorRatio !== 100) {
      alert('Total nisbah harus tepat 100%!');
      return;
    }
    if (!nisbahReason.trim()) {
      alert('Mohon masukkan alasan perubahan nisbah untuk catatan audit syariah.');
      return;
    }

    const success = updateNisbah(takmirRatio, operatorRatio, nisbahReason);
    if (success) {
      alert('Nisbah berhasil diperbarui dan dicatat dalam audit trail!');
      setNisbahReason('');
    } else {
      alert('Gagal memperbarui nisbah.');
    }
  };

  const handleCreateDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    setDistFormError(null);
    setDistFormSuccess(null);

    if (!distTitle.trim()) {
      setDistFormError('Judul program penyaluran wajib diisi.');
      return;
    }

    if (distAmount <= 0) {
      setDistFormError('Nominal penyaluran harus lebih dari Rp0.');
      return;
    }

    if (distAmount > donationSummary.balanceAvailable) {
      setDistFormError(
        `Nominal penyaluran (${formatRupiah(distAmount)}) melebihi saldo sedekah tersedia (${formatRupiah(donationSummary.balanceAvailable)}).`
      );
      return;
    }

    const result = addDonationDistribution({
      title: distTitle,
      description: distDescription,
      targetInstitution: distInstitution,
      totalAmount: distAmount,
      evidenceUrl: '/documents/bukti-transfer-simulasi.pdf',
    });

    if (result.success) {
      setDistFormSuccess('Program penyaluran sedekah baru berhasil dicatat dan berstatus PENDING menunggu verifikasi dokumen.');
      setDistTitle('');
      setDistAmount(Math.min(100000, donationSummary.balanceAvailable));
    } else {
      setDistFormError(result.message || 'Gagal menambahkan program penyaluran.');
    }
  };

  const handleVerifyCurrentReport = () => {
    const verifier = currentUser?.fullName || 'Dr. Ir. H. Syamsul (Ketua Dewan Takmir Masjid UNIB)';
    if (confirm(`Apakah Anda yakin ingin mengesahkan dan mengunci Laporan Keuangan Periode: ${currentDynamicReport.periodLabel}?\n\nLaporan yang disahkan akan tersimpan permanen dalam arsip keuangan.`)) {
      verifyCurrentReport(verifier);
      alert(`Laporan keuangan periode ${currentDynamicReport.periodLabel} resmi disahkan & dikunci.`);
    }
  };

  const handleRejectCurrentReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionNotes.trim()) {
      alert('Catatan evaluasi / alasan penolakan wajib diisi!');
      return;
    }
    rejectCurrentReport(rejectionNotes);
    setRejectModalOpen(false);
    setRejectionNotes('');
    alert('Laporan keuangan dikembalikan ke pengelola kedai dengan catatan evaluasi.');
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FDFBF7] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Takmir Banner */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-[#2D5A43] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm print:hidden">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                PENGAWASAN TAKMIR (SHAHIBUL MAAL)
              </span>
              <span className="rounded-full bg-emerald-300/20 text-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Audit Aktif
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Pengawasan Finansial, Mudharabah &amp; Sedekah
            </h1>
            <p className="text-xs text-white/80 max-w-xl leading-relaxed">
              Memantau laporan keuangan berkala, mengesahkan bagi hasil 60:40 tanpa sisa pembulatan, serta menjamin pemisahan mutlak pool dana sedekah produktif.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-xs space-y-1 backdrop-blur-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/70">Nisbah Aktif:</span>
                <strong className="font-serif text-sm text-amber-300">
                  {mudharabahSetting.shahibulMaalRatio}% Takmir : {mudharabahSetting.mudharibRatio}% Mudharib
                </strong>
              </div>
              <div className="text-[11px] text-white/60">
                Modal Awal Simulasi: <strong>Rp25.000.000</strong>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 px-4 py-3 text-xs font-bold text-white transition-colors border border-white/20 shadow-xs"
              title="Cetak atau simpan sebagai PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* 4 Financial KPI Counters (Always Real-Time Validated) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
          {/* Revenue */}
          <div className="rounded-2xl border border-[#E8DBCB] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 block">Total Omzet Penjualan</span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Hanya Terbayar
              </span>
            </div>
            <span className="font-serif text-2xl font-bold text-[#2C1810] mt-1 block">
              {formatRupiah(currentDynamicReport.grossRevenue)}
            </span>
            <span className="text-[11px] text-gray-500">
              {currentDynamicReport.totalTransactions} transaksi ({currentDynamicReport.totalItemsSold} porsi menu)
            </span>
          </div>

          {/* Net Profit / Loss */}
          <div className={`rounded-2xl border p-5 shadow-2xs ${
            currentDynamicReport.isLoss 
              ? 'border-red-300 bg-red-50/70 text-red-950' 
              : 'border-emerald-300 bg-emerald-50/60 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold block">
                {currentDynamicReport.isLoss ? 'Rugi Bersih Usaha' : 'Laba Bersih Siap Bagi Hasil'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                currentDynamicReport.isLoss ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'
              }`}>
                {currentDynamicReport.isLoss ? 'KONDISI RUGI' : 'LABA'}
              </span>
            </div>
            <span className="font-serif text-2xl font-bold mt-1 block">
              {formatRupiah(Math.abs(currentDynamicReport.netProfit))}
            </span>
            <span className="text-[11px] opacity-80">
              Omzet − HPP ({formatRupiah(currentDynamicReport.totalHpp)}) − Biaya ({formatRupiah(currentDynamicReport.totalOperationalCost)})
            </span>
          </div>

          {/* Mudharabah Split Summary */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-2xs">
            <span className="text-xs font-semibold text-amber-900 block">
              Bagi Hasil Takmir vs Pengelola
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-xl font-bold text-amber-950">
                {formatRupiah(currentDynamicReport.takmirShare)}
              </span>
              <span className="text-xs text-amber-700">/</span>
              <span className="font-serif text-base font-bold text-amber-900">
                {formatRupiah(currentDynamicReport.operatorShare)}
              </span>
            </div>
            <span className="text-[11px] text-amber-800">
              Nisbah: {currentDynamicReport.nisbahTakmir}% (Takmir) : {currentDynamicReport.nisbahOperator}% (Mudharib)
            </span>
          </div>

          {/* Pure Donation Pool (Strictly Separated) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-950 block">Saldo Sedekah Pelanggan</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-200/60 px-2 py-0.5 rounded-full">
                TERPISAH MUTLAK
              </span>
            </div>
            <span className="font-serif text-2xl font-bold text-blue-950 mt-1 block">
              {formatRupiah(donationSummary.balanceAvailable)}
            </span>
            <span className="text-[11px] text-blue-800">
              Diterima: {formatRupiah(donationSummary.totalReceived)} • Salur: {formatRupiah(donationSummary.totalDisbursed)}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8DBCB] gap-2 overflow-x-auto pb-px print:hidden">
          {[
            { id: 'ringkasan', label: 'Dashboard & Laporan Periode', icon: FileCheck2 },
            { id: 'laporan_tersimpan', label: `Arsip Laporan Disahkan (${verifiedReports.length})`, icon: Lock },
            { id: 'sedekah', label: `Kelola & Verifikasi Sedekah (${donationDistributions.length})`, icon: HeartHandshake },
            { id: 'nisbah', label: 'Nisbah & Riwayat Syariah', icon: Settings },
            { id: 'audit', label: `Jejak Audit Trail (${auditLogs.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-[#2D5A43] bg-white text-[#2D5A43] font-bold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: RINGKASAN & LAPORAN PERIODE DINAMIS                     */}
        {/* ============================================================== */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            
            {/* Period Filter Bar */}
            <div className="rounded-2xl border border-[#E8DBCB] bg-white p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Filter className="h-4 w-4 text-[#2D5A43]" />
                <span>Filter Periode Analisis:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'today', label: 'Hari Ini' },
                  { key: 'this_week', label: 'Minggu Ini' },
                  { key: 'this_month', label: 'Bulan Ini' },
                  { key: 'this_year', label: 'Tahun Ini' },
                  { key: 'custom', label: 'Rentang Khusus' },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPeriodFilter(p.key as PeriodFilter)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                      periodFilter === p.key
                        ? 'bg-[#2D5A43] text-white shadow-xs font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Inputs if 'custom' is active */}
              {periodFilter === 'custom' && (
                <div className="flex items-center gap-2 text-xs pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="rounded-lg border border-[#E8DBCB] px-2.5 py-1 text-gray-800"
                  />
                  <span className="text-gray-400">s/d</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="rounded-lg border border-[#E8DBCB] px-2.5 py-1 text-gray-800"
                  />
                </div>
              )}
            </div>

            {/* Sharia Loss Banner if Net Profit <= 0 */}
            {currentDynamicReport.isLoss && (
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-950 space-y-2">
                <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                  <span>PERINGATAN KETENTUAN MUDHARABAH: KONDISI USAHA MENGALAMI KERUGIAN</span>
                </div>
                <p className="text-xs text-red-900 leading-relaxed">
                  Pada periode ini ({currentDynamicReport.periodLabel}), total pendapatan lebih kecil daripada total HPP dan biaya operasional yang dikeluarkan (Defisit: {formatRupiah(Math.abs(currentDynamicReport.netProfit))}).
                </p>
                <div className="rounded-xl bg-white/80 p-3 text-xs border border-red-200 space-y-1">
                  <strong>Kaidah Fikih Mudharabah:</strong>
                  <ul className="list-disc list-inside text-[11px] text-red-900 space-y-0.5">
                    <li>Tidak ada bagi hasil pada kondisi merugi. Hak Takmir = Rp0 dan Hak Pengelola = Rp0.</li>
                    <li>Kerugian finansial ditanggung sepenuhnya oleh Shahibul Maal (Takmir Masjid dari dana modal usaha), sedangkan Mudharib (Pengelola) menanggung kerugian waktu dan tenaga.</li>
                    <li>Pengelola tidak menanggung kerugian materi kecuali terbukti melakukan kelalaian nyata (ta&apos;addi), kecurangan, atau menyalahi kesepakatan akad.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Main Financial Report Document Card */}
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm print:border-none print:shadow-none print:p-0">
              
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      LAPORAN HASIL USAHA RESMI
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      ID: {currentDynamicReport.id}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#2C1810] mt-1">
                    Laporan Hasil Usaha {currentDynamicReport.periodLabel}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Kedai Kopi Seduh Berkah • Lingkungan Masjid Kampus Universitas Bengkulu
                  </p>
                </div>

                {/* Actions / Status */}
                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <span className={`rounded-xl px-3 py-1.5 text-xs font-bold border ${
                    currentDynamicReport.status === 'verified_by_takmir'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : currentDynamicReport.status === 'rejected'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {currentDynamicReport.status === 'verified_by_takmir'
                      ? '✓ RESMI TERVERIFIKASI & DIKUNCI'
                      : currentDynamicReport.status === 'rejected'
                      ? '✕ LAPORAN DITOLAK / REVISI'
                      : '• DRAFT / MENUNGGU PENGESAHAN'}
                  </span>

                  {currentDynamicReport.status !== 'verified_by_takmir' && (
                    <>
                      <button
                        onClick={handleVerifyCurrentReport}
                        className="rounded-xl bg-[#2D5A43] hover:bg-[#20402E] px-4 py-2 text-xs font-bold text-white shadow-xs"
                      >
                        Sahkan &amp; Kunci Laporan
                      </button>
                      <button
                        onClick={() => setRejectModalOpen(true)}
                        className="rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-bold text-red-700"
                      >
                        Tolak Laporan
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Ledger Table */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F5EBE1] text-[#2C1810] font-serif">
                    <tr>
                      <th className="p-3.5">Komponen Keuangan</th>
                      <th className="p-3.5">Keterangan / Rincian</th>
                      <th className="p-3.5 text-right">Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Gross Revenue */}
                    <tr className="bg-emerald-50/20">
                      <td className="p-3.5 font-bold text-gray-900">
                        1. Pendapatan Penjualan Produk (Omzet)
                      </td>
                      <td className="p-3.5 text-gray-600">
                        {currentDynamicReport.totalTransactions} pesanan terbayar ({currentDynamicReport.totalItemsSold} porsi terjual)
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-900 text-sm">
                        {formatRupiah(currentDynamicReport.grossRevenue)}
                      </td>
                    </tr>

                    {/* HPP Breakdown Summary */}
                    <tr>
                      <td className="p-3.5 font-semibold text-red-700">
                        2. Total HPP Bahan Baku Terjual
                      </td>
                      <td className="p-3.5 text-gray-600">
                        Bahan baku biji Robusta Bengkulu, susu segar, gula aren, cup &amp; packaging
                      </td>
                      <td className="p-3.5 text-right font-semibold text-red-700">
                        − {formatRupiah(currentDynamicReport.totalHpp)}
                      </td>
                    </tr>

                    {/* Gross Profit */}
                    <tr className="bg-gray-50 font-semibold text-gray-800">
                      <td className="p-3.5">
                        Laba Kotor Operasional (Gross Profit)
                      </td>
                      <td className="p-3.5 text-gray-500 text-[11px]">
                        Omzet Penjualan dikurangi Total HPP
                      </td>
                      <td className="p-3.5 text-right text-gray-900 font-bold">
                        {formatRupiah(currentDynamicReport.grossProfit)}
                      </td>
                    </tr>

                    {/* Operational Costs */}
                    <tr>
                      <td className="p-3.5 font-semibold text-red-700">
                        3. Total Biaya Operasional Kedai (Terbayar)
                      </td>
                      <td className="p-3.5 text-gray-600">
                        Biaya tetap, variabel utilitas, dan kerugian bahan baku (waste)
                      </td>
                      <td className="p-3.5 text-right font-semibold text-red-700">
                        − {formatRupiah(currentDynamicReport.totalOperationalCost)}
                      </td>
                    </tr>

                    {/* Net Profit */}
                    <tr className="bg-amber-100/80 font-bold text-sm text-[#2C1810]">
                      <td className="p-3.5">
                        4. Laba Bersih Usaha (Net Profit)
                      </td>
                      <td className="p-3.5 font-normal text-xs text-gray-700">
                        Basis pembagian hasil Mudharabah (Laba Kotor − Biaya Operasional)
                      </td>
                      <td className="p-3.5 text-right text-base">
                        {currentDynamicReport.isLoss ? (
                          <span className="text-red-700">
                            − {formatRupiah(Math.abs(currentDynamicReport.netProfit))}
                          </span>
                        ) : (
                          formatRupiah(currentDynamicReport.netProfit)
                        )}
                      </td>
                    </tr>

                    {/* Mudharabah Distribution Row */}
                    {!currentDynamicReport.isLoss && (
                      <>
                        <tr className="bg-emerald-50/60">
                          <td className="p-3.5 pl-6 font-semibold text-emerald-950">
                            ↳ Hak Takmir Masjid (Shahibul Maal)
                          </td>
                          <td className="p-3.5 text-emerald-800 text-[11px]">
                            Nisbah {currentDynamicReport.nisbahTakmir}% dari Laba Bersih (Pembulatan ke bawah)
                          </td>
                          <td className="p-3.5 text-right font-bold text-emerald-900">
                            {formatRupiah(currentDynamicReport.takmirShare)}
                          </td>
                        </tr>
                        <tr className="bg-amber-50/60">
                          <td className="p-3.5 pl-6 font-semibold text-amber-950">
                            ↳ Hak Pengelola Kedai (Mudharib)
                          </td>
                          <td className="p-3.5 text-amber-800 text-[11px]">
                            Nisbah {currentDynamicReport.nisbahOperator}% dari Laba Bersih (Sisa tanpa selisih)
                          </td>
                          <td className="p-3.5 text-right font-bold text-amber-900">
                            {formatRupiah(currentDynamicReport.operatorShare)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Sharia Separation Callout */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <ShieldCheck className="h-4 w-4 text-blue-700" />
                  <span>Prinsip Pemisahan Mutlak Dana Sedekah Sukarela:</span>
                </div>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  Dana sedekah sukarela sebesar <strong>{formatRupiah(currentDynamicReport.totalDonationPool || 0)}</strong> pada periode ini dicatat pada pool terpisah dan <strong>tidak dimasukkan</strong> ke dalam tabel pendapatan kedai maupun diperhitungkan dalam nisbah mudharabah di atas.
                </p>
              </div>

              {/* HPP Breakdown by Menu */}
              {currentDynamicReport.productHppBreakdown.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-serif text-sm font-bold text-[#2C1810]">
                    Rincian Penjualan &amp; HPP per Menu Robusta Bengkulu:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {currentDynamicReport.productHppBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200 bg-[#FDFBF7] p-3 space-y-1"
                      >
                        <span className="font-semibold text-gray-900 block truncate">
                          {item.name}
                        </span>
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span>Terjual: <strong>{item.quantity} porsi</strong></span>
                          <span>HPP Satuan: {formatRupiah(item.unitHpp)}</span>
                        </div>
                        <div className="pt-1 border-t border-gray-200 flex justify-between font-bold text-gray-800 text-[11px]">
                          <span>Total HPP:</span>
                          <span className="text-red-700">{formatRupiah(item.totalHpp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signatures for Print and Formal Verification */}
              <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-12">
                  <span className="text-gray-500 block">
                    Disusun Oleh (Mudharib):
                  </span>
                  <div>
                    <span className="font-bold text-gray-900 block underline">
                      {currentDynamicReport.submittedBy || 'Pengelola Kedai Kopi'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Pelaksana Usaha Kedai Seduh Berkah
                    </span>
                  </div>
                </div>

                <div className="space-y-12">
                  <span className="text-gray-500 block">
                    Disahkan Oleh (Shahibul Maal):
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950 block underline">
                      {currentDynamicReport.verifiedBy || 'Dr. Ir. H. Syamsul'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Ketua Dewan Takmir Masjid Kampus UNIB
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ARSIP LAPORAN TERKUNCI                                  */}
        {/* ============================================================== */}
        {activeTab === 'laporan_tersimpan' && (
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                Arsip Laporan Keuangan yang Telah Disahkan &amp; Terkunci
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Laporan yang telah diverifikasi tidak dapat diubah kembali untuk menjamin kepatuhan audit syariah.
              </p>
            </div>

            <div className="space-y-4">
              {verifiedReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-emerald-200 bg-[#FDFBF7] p-5 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#2D5A43]" />
                        <span className="font-serif text-base font-bold text-[#2C1810]">
                          {report.periodLabel}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5">
                          TERKUNCI TAKMIR
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 block mt-1">
                        Diverifikasi oleh: <strong>{report.verifiedBy || 'Takmir Masjid UNIB'}</strong> pada {report.verifiedAt ? formatDateOnly(report.verifiedAt) : '31 Oktober 2026'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-emerald-950 block">
                        {formatRupiah(report.netProfit)}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Laba Bersih Siap Bagi Hasil
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200 text-xs">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Omzet:</span>
                      <strong className="text-gray-900">{formatRupiah(report.grossRevenue)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Total HPP:</span>
                      <strong className="text-red-700">{formatRupiah(report.totalHpp)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Hak Takmir ({report.nisbahTakmir}%):</span>
                      <strong className="text-emerald-900">{formatRupiah(report.takmirShare || report.shahibulMaalShare || 0)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Hak Pengelola ({report.nisbahOperator}%):</span>
                      <strong className="text-amber-900">{formatRupiah(report.operatorShare || report.mudharibShare || 0)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MANAJEMEN SEDEKAH & VERIFIKASI BUKTI PENYALURAN         */}
        {/* ============================================================== */}
        {activeTab === 'sedekah' && (
          <div className="space-y-6">
            
            {/* Sedekah Summary Card */}
            <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-800 bg-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                  POOL AMANAH SEDEKAH KAMPUS
                </span>
                <h2 className="font-serif text-2xl font-bold text-blue-950">
                  Manajemen &amp; Verifikasi Penyaluran Sedekah
                </h2>
                <p className="text-xs text-blue-900 max-w-xl leading-relaxed">
                  Sedekah sukarela Rp1.000 per porsi yang dititipkan pelanggan dihimpun di sini. Takmir bertugas memvalidasi bukti transfer dan dokumentasi penyaluran sebelum dipublikasikan ke jamaah.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center bg-white/80 p-4 rounded-2xl border border-blue-200 text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] block">Total Diterima</span>
                  <strong className="font-serif text-sm text-[#2C1810]">
                    {formatRupiah(donationSummary.totalReceived)}
                  </strong>
                </div>
                <div className="border-x border-gray-200 px-2">
                  <span className="text-gray-500 text-[10px] block">Tersalurkan</span>
                  <strong className="font-serif text-sm text-emerald-800">
                    {formatRupiah(donationSummary.totalDisbursed)}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Saldo Sisa</span>
                  <strong className="font-serif text-sm text-blue-900">
                    {formatRupiah(donationSummary.balanceAvailable)}
                  </strong>
                </div>
              </div>
            </div>

            {/* List of Distribution Batches */}
            <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DBCB]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                    Daftar Program Penyaluran Sedekah
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hanya berkas bukti yang disetujui Takmir yang tampil di halaman transparansi publik.
                  </p>
                </div>

                <div className="text-xs font-semibold text-gray-700">
                  Sisa Saldo Kas: <strong className="text-blue-700">{formatRupiah(donationSummary.balanceAvailable)}</strong>
                </div>
              </div>

              {/* Distributions List */}
              <div className="space-y-4">
                {donationDistributions.map((dist) => (
                  <div
                    key={dist.id}
                    className="rounded-2xl border border-[#E8DBCB] bg-[#FDFBF7] p-5 space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#8E5230]">
                            {dist.distributionCode}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            dist.status === 'disbursed' || dist.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-900'
                              : dist.status === 'rejected'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {dist.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2C1810] mt-1">
                          {dist.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5 max-w-2xl leading-relaxed">
                          {dist.description}
                        </p>
                        <span className="text-[11px] text-gray-500 block mt-1">
                          Mitra Penyalur: <strong className="text-gray-800">{dist.targetInstitution}</strong> • Tanggal: {dist.distributedAt ? formatDateOnly(dist.distributedAt) : '-'}
                        </span>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="font-serif text-xl font-bold text-[#2D5A43]">
                          {formatRupiah(dist.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Evidence Review Section */}
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-xs font-semibold text-gray-700 block mb-2">
                        Dokumen Bukti Penyaluran (Verifikasi Takmir):
                      </span>

                      {dist.evidence.length === 0 ? (
                        <p className="text-xs italic text-gray-400">Belum ada dokumen bukti yang dilampirkan.</p>
                      ) : (
                        <div className="space-y-2">
                          {dist.evidence.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white text-xs"
                            >
                              <div className="space-y-0.5">
                                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                                  <FileText className="h-4 w-4 text-[#2D5A43]" />
                                  <span>{ev.fileName}</span>
                                </span>
                                <span className="text-[11px] text-gray-500 block">
                                  Diunggah oleh: {ev.uploadedBy} • Catatan: {ev.notes || '-'}
                                </span>
                                {ev.rejectionReason && (
                                  <span className="text-[11px] text-red-600 font-semibold block">
                                    Alasan Penolakan Takmir: {ev.rejectionReason}
                                  </span>
                                )}
                              </div>

                              {/* Evidence Actions */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                    ev.verificationStatus === 'verified'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ev.verificationStatus === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {ev.verificationStatus.toUpperCase()}
                                </span>

                                {ev.verificationStatus === 'pending' && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateEvidenceStatus(
                                          dist.id,
                                          ev.id,
                                          'verified',
                                          'Takmir Masjid Kampus UNIB'
                                        )
                                      }
                                      className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                                    >
                                      ✓ Setujui
                                    </button>
                                    <button
                                      onClick={() => {
                                        const reason = prompt('Masukkan alasan penolakan bukti penyaluran:');
                                        if (reason && reason.trim()) {
                                          updateEvidenceStatus(
                                            dist.id,
                                            ev.id,
                                            'rejected',
                                            'Takmir Masjid Kampus UNIB',
                                            reason
                                          );
                                        }
                                      }}
                                      className="rounded-lg border border-red-300 px-3 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                                    >
                                      ✕ Tolak
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Add New Distribution with Strict Balance Validation */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-serif text-base font-bold text-[#2C1810] mb-2">
                  + Buat Rencana Penyaluran Sedekah Baru
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Sistem secara ketat memvalidasi agar nominal penyaluran tidak melebihi sisa kas sedekah yang tersedia ({formatRupiah(donationSummary.balanceAvailable)}).
                </p>

                {distFormError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{distFormError}</span>
                  </div>
                )}

                {distFormSuccess && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>{distFormSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleCreateDistribution} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Judul Program Penyaluran:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Santunan Paket Sembako Mahasiswa Dhuafa..."
                        value={distTitle}
                        onChange={(e) => setDistTitle(e.target.value)}
                        className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Mitra Lembaga Penyalur:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Lembaga Amil Zakat Mitra Kampus..."
                        value={distInstitution}
                        onChange={(e) => setDistInstitution(e.target.value)}
                        className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Nominal Penyaluran (Rp):
                      </label>
                      <input
                        type="number"
                        min={1000}
                        step={10000}
                        max={donationSummary.balanceAvailable}
                        required
                        value={distAmount}
                        onChange={(e) => setDistAmount(parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 font-bold"
                      />
                      <span className="text-[11px] text-gray-500 mt-0.5 block">
                        Maksimal tersedia: {formatRupiah(donationSummary.balanceAvailable)}
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Deskripsi / Manfaat:
                      </label>
                      <input
                        type="text"
                        value={distDescription}
                        onChange={(e) => setDistDescription(e.target.value)}
                        className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={donationSummary.balanceAvailable <= 0}
                    className="rounded-xl bg-[#2D5A43] hover:bg-[#20402E] px-5 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Simpan Rencana Penyaluran
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: KONFIGURASI NISBAH & RIWAYAT PERUBAHAN                   */}
        {/* ============================================================== */}
        {activeTab === 'nisbah' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Edit Nisbah */}
            <div className="lg:col-span-1 rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  Pengaturan Nisbah Mudharabah
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Penyesuaian nisbah bagi hasil bersih disepakati antara Takmir dan Pengelola kedai dengan pencatatan alasan syariah.
                </p>
              </div>

              <form onSubmit={handleSaveNisbah} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Bagian Takmir (Shahibul Maal): {takmirRatio}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={takmirRatio}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setTakmirRatio(val);
                      setOperatorRatio(100 - val);
                    }}
                    className="w-full accent-[#2D5A43]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Bagian Pengelola (Mudharib): {operatorRatio}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={operatorRatio}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setOperatorRatio(val);
                      setTakmirRatio(100 - val);
                    }}
                    className="w-full accent-amber-600"
                  />
                </div>

                <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-950 text-xs">
                  <span className="font-bold">Total Pembagian: </span>
                  <span className="font-mono">{takmirRatio}% + {operatorRatio}% = {takmirRatio + operatorRatio}%</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Alasan Perubahan (Wajib untuk Catatan Audit Syariah):
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Contoh: Penyesuaian nisbah setelah evaluasi kinerja operasional semester pertama..."
                    value={nisbahReason}
                    onChange={(e) => setNisbahReason(e.target.value)}
                    className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#2D5A43] hover:bg-[#20402E] py-3 text-xs font-bold text-white transition-colors"
                >
                  Simpan &amp; Sahkan Nisbah Baru
                </button>
              </form>
            </div>

            {/* Nisbah History Table */}
            <div className="lg:col-span-2 rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C1810]">
                  Riwayat Perubahan Nisbah (Audit Trail)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rekam jejak setiap perubahan nisbah mudharabah beserta otorisator dan alasannya.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F5EBE1] text-[#2C1810] font-serif">
                    <tr>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Otorisator</th>
                      <th className="p-3">Nisbah Baru</th>
                      <th className="p-3">Alasan Penetapan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {nisbahHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 text-gray-500 whitespace-nowrap">
                          {item.timestamp}
                        </td>
                        <td className="p-3 font-semibold text-gray-800">
                          {item.changedBy}
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-[#2D5A43]">
                            {item.newShahibulMaalRatio}% : {item.newMudharibRatio}%
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 leading-relaxed">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: JEJAK AUDIT TRAIL LENGKAP                               */}
        {/* ============================================================== */}
        {activeTab === 'audit' && (
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2C1810]">
                Jejak Audit Aktivitas Finansial &amp; Transaksi
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Log sistem otomatis mencatat seluruh pengesahan, pencatatan biaya, perubahan nisbah, dan verifikasi bukti.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F5EBE1] text-[#2C1810] font-serif">
                  <tr>
                    <th className="p-3.5">Waktu</th>
                    <th className="p-3.5">Peran / Pengguna</th>
                    <th className="p-3.5">Aksi Sistem</th>
                    <th className="p-3.5">Rincian Perubahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 text-gray-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-700">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] font-bold text-[#2D5A43]">
                        {log.action}
                      </td>
                      <td className="p-3.5 text-gray-700 leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Rejection Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#E8DBCB] bg-white p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-red-950">
              Tolak &amp; Kembalikan Laporan Keuangan
            </h3>
            <p className="text-xs text-gray-600">
              Masukkan alasan atau catatan perbaikan agar pengelola kedai dapat meninjau dan merevisi data transaksi/biaya yang kurang tepat.
            </p>
            <form onSubmit={handleRejectCurrentReport} className="space-y-4 text-xs">
              <textarea
                rows={4}
                required
                placeholder="Tuliskan catatan evaluasi di sini..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                className="w-full rounded-xl border border-red-200 p-3 text-gray-900"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white"
                >
                  Kirim Catatan Penolakan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
