'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context';
import { signInUser } from '@/services/auth.service';
import { Coffee, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const { setActiveRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Demo Account Helpers
  const handleSelectDemoAccount = (role: 'customer' | 'operator' | 'takmir') => {
    if (role === 'takmir') {
      setEmail('takmir@seduhberkah.unib.ac.id');
      setPassword('berkah2026');
    } else if (role === 'operator') {
      setEmail('operator@seduhberkah.unib.ac.id');
      setPassword('berkah2026');
    } else {
      setEmail('ahmad.faiz@mhs.unib.ac.id');
      setPassword('berkah2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await signInUser(email, password);

      if (res.error) {
        setErrorMsg(res.error);
        setIsLoading(false);
        return;
      }

      // Determine role from profile or email
      const role =
        res.profile?.role ||
        (email.includes('takmir') ? 'takmir' : email.includes('operator') ? 'operator' : 'customer');

      setActiveRole(role);

      // Redirect accordingly
      if (redirectTo) {
        router.push(redirectTo);
      } else if (role === 'takmir') {
        router.push('/takmir');
      } else if (role === 'operator') {
        router.push('/operator');
      } else {
        router.push('/pesanan');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E8DBCB] bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2C1810] text-amber-300 shadow-sm">
          <Coffee className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#2C1810]">
          Masuk ke SEDUH BERKAH
        </h1>
        <p className="text-xs text-gray-600">
          Akses akun pelanggan, operasional kedai, atau pengawasan takmir
        </p>
      </div>

      {/* Demo Account Presets */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#2C1810] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            Pilih Cepat Akun
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Uji Akses Cepat</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectDemoAccount('customer')}
            className="rounded-lg border border-amber-300/80 bg-white p-1.5 text-[11px] font-semibold text-gray-800 hover:bg-amber-100/50"
          >
            Pelanggan
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemoAccount('operator')}
            className="rounded-lg border border-amber-300/80 bg-white p-1.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/50"
          >
            Operator
          </button>
          <button
            type="button"
            onClick={() => handleSelectDemoAccount('takmir')}
            className="rounded-lg border border-amber-300/80 bg-white p-1.5 text-[11px] font-semibold text-emerald-900 hover:bg-amber-100/50"
          >
            Takmir
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
          <label className="block font-semibold text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[#E8DBCB] p-2.5 text-gray-900 focus:border-[#8E5230] focus:ring-1 focus:ring-[#8E5230] outline-hidden"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2C1810] py-3 font-bold text-white shadow-sm hover:bg-[#8E5230] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span>Memproses Masuk...</span>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Links */}
      <div className="pt-2 text-center text-xs text-gray-600 space-y-2">
        <p>
          Belum punya akun pelanggan?{' '}
          <Link href="/daftar" className="font-semibold text-[#8E5230] hover:underline">
            Daftar Sekarang
          </Link>
        </p>
        <p className="text-[11px] text-gray-400">
          *Tamu tetap dapat memesan kopi tanpa login (Guest Checkout)
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-20 bg-[#FDFBF7]">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <Suspense fallback={<div className="text-center text-xs text-gray-500 py-10">Memuat formulir masuk...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
