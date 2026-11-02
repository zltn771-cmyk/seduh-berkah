'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import {
  Coffee,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  User,
  ShieldCheck,
  Building2,
  LogIn,
  LogOut,
  Database,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { activeRole, setActiveRole, totalPortionsInCart, currentUser, logout, isSupabaseConnected } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Katalog Menu', href: '/menu' },
    { label: 'Status Pesanan', href: '/pesanan' },
    { label: 'Transparansi Sedekah', href: '/transparansi' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8DBCB] bg-[#FDFBF7]/95 backdrop-blur-md">
      {/* Top Demo Role Banner */}
      <div className="border-b border-amber-200/60 bg-[#F5EBE1] px-4 py-1.5 text-xs text-[#3D2314]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-900">
              SIMULASI ROLE
            </span>
            <span className="hidden text-xs text-gray-700 sm:inline">
              Pilih peran untuk menguji alur kerja:
            </span>
            {isSupabaseConnected ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                <Database className="h-3 w-3" />
                Supabase Terhubung
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-medium bg-amber-200/60 px-2 py-0.5 rounded-full">
                Mode Simulasi / Mock
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveRole('customer')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeRole === 'customer'
                  ? 'bg-[#2C1810] text-[#FDFBF7] shadow-xs'
                  : 'text-gray-700 hover:bg-black/5'
              }`}
            >
              <User className="h-3 w-3" />
              <span>Pelanggan</span>
            </button>

            <button
              onClick={() => setActiveRole('operator')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeRole === 'operator'
                  ? 'bg-[#8E5230] text-[#FDFBF7] shadow-xs'
                  : 'text-gray-700 hover:bg-black/5'
              }`}
            >
              <Coffee className="h-3 w-3" />
              <span>Operator (Mudharib)</span>
            </button>

            <button
              onClick={() => setActiveRole('takmir')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activeRole === 'takmir'
                  ? 'bg-[#2D5A43] text-[#FDFBF7] shadow-xs'
                  : 'text-gray-700 hover:bg-black/5'
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>Takmir (Shahibul Maal)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C1810] text-[#FDFBF7] shadow-sm transition-transform group-hover:scale-105">
            <Coffee className="h-5 w-5 text-amber-300" />
          </div>
          <div>
            <span className="block font-serif text-lg font-bold tracking-tight text-[#2C1810]">
              SEDUH BERKAH
            </span>
            <span className="block text-[10px] font-medium tracking-wide text-[#8E5230] -mt-1">
              Robusta Bengkulu &amp; Masjid UNIB
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#8E5230] ${
                  isActive ? 'text-[#8E5230] font-semibold border-b-2 border-[#8E5230] pb-1' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Quick link to active dashboard based on role */}
          {activeRole === 'operator' && (
            <Link
              href="/operator"
              className="flex items-center gap-1.5 rounded-lg bg-[#8E5230]/10 px-3 py-1.5 text-xs font-semibold text-[#8E5230] hover:bg-[#8E5230]/20"
            >
              <Coffee className="h-3.5 w-3.5" />
              <span>Panel Kasir / Barista</span>
            </Link>
          )}

          {activeRole === 'takmir' && (
            <Link
              href="/takmir"
              className="flex items-center gap-1.5 rounded-lg bg-[#2D5A43]/10 px-3 py-1.5 text-xs font-semibold text-[#2D5A43] hover:bg-[#2D5A43]/20"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Panel Takmir (Nisbah 60:40)</span>
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-3">
              <span className="text-xs font-semibold text-gray-800">
                {currentUser.fullName}
              </span>
              <button
                onClick={() => logout()}
                className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100"
                title="Keluar Akun"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/masuk"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#E8DBCB] px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#F5EBE1] transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Masuk</span>
            </Link>
          )}

          <Link
            href="/keranjang"
            className="relative flex items-center gap-2 rounded-xl bg-[#2C1810] px-3.5 py-2 text-xs font-semibold text-[#FDFBF7] shadow-sm transition-all hover:bg-[#3E2316] active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Keranjang</span>
            {totalPortionsInCart > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-[#2C1810]">
                {totalPortionsInCart}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8DBCB] text-gray-700"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DBCB] bg-[#FDFBF7] px-4 py-4 space-y-2">
          {currentUser && (
            <div className="pb-2 border-b border-[#E8DBCB] flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-900">{currentUser.fullName} ({currentUser.role})</span>
              <button onClick={() => logout()} className="text-red-600 font-medium">Keluar</button>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === link.href ? 'bg-[#F5EBE1] text-[#8E5230] font-bold' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!currentUser && (
            <Link
              href="/masuk"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-[#F5EBE1]"
            >
              Masuk / Daftar Akun
            </Link>
          )}

          <div className="pt-2 border-t border-[#E8DBCB]/60 space-y-1">
            <span className="block px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Akses Khusus Peran
            </span>
            <Link
              href="/operator"
              onClick={() => {
                setActiveRole('operator');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#8E5230] hover:bg-[#8E5230]/10"
            >
              <Coffee className="h-4 w-4" />
              <span>Masuk Panel Operator Kedai</span>
            </Link>
            <Link
              href="/takmir"
              onClick={() => {
                setActiveRole('takmir');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#2D5A43] hover:bg-[#2D5A43]/10"
            >
              <Building2 className="h-4 w-4" />
              <span>Masuk Panel Pengawasan Takmir</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
