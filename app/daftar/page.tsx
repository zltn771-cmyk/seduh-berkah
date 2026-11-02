'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpCustomer } from '@/services/auth.service';
import { Coffee, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await signUpCustomer(email, password, fullName, phone);

      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Pendaftaran gagal');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-16 sm:py-24 bg-[#FDFBF7]">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#2D5A43]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1810]">
              Akun Berhasil Didaftarkan!
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              Selamat bergabung dengan ekosistem SEDUH BERKAH. Akun pelanggan Anda telah terdaftar.
            </p>
            <div className="pt-4 space-y-2">
              <Link
                href="/masuk"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2C1810] py-3 text-xs font-bold text-white hover:bg-[#8E5230]"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-[#FDFBF7]">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2C1810] text-amber-300 shadow-sm">
              <Coffee className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2C1810]">
              Daftar Akun Pelanggan
            </h1>
            <p className="text-xs text-gray-600">
              Simpan riwayat pesanan dan pantau kontribusi sedekah Anda
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Muhammad Ilham"
                className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
              />
            </div>

            {/* Note about role privilege security */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-[11px] text-gray-600">
              *Pendaftaran publik secara otomatis menetapkan role <strong>Pelanggan</strong>. Hak akses istimewa (Operator Kedai atau Takmir) hanya dapat diberikan secara administratif.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2C1810] py-3 font-bold text-white shadow-sm hover:bg-[#8E5230] transition-colors disabled:opacity-50"
            >
              {isLoading ? <span>Mendaftarkan Akun...</span> : <span>Daftar Akun Baru</span>}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-600">
            Sudah memiliki akun?{' '}
            <Link href="/masuk" className="font-semibold text-[#8E5230] hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
