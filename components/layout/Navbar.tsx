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
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { activeRole, setActiveRole, totalPortionsInCart, currentUser, logout, isSupabaseConnected } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Katalog 6 Menu', href: '/menu', badge: 'Robusta' },
    { label: 'Status Antrean', href: '/pesanan' },
    { label: 'Transparansi Sedekah', href: '/transparansi', badge: 'Syariah' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Top Simulation Role Switcher Bar */}
        <div className="border-b border-[#E8DBCB]/80 bg-[#F6EFE6] px-3 py-1.5 text-xs text-[#2C1810]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-2 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2C1810] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 shadow-2xs">
                <Sparkles className="h-2.5 w-2.5" />
                SIMULASI ROLE
              </span>
              <span className="hidden text-[11px] text-[#8E5230] font-medium md:inline">
                Pilih peran untuk menguji alur kerja:
              </span>
            </div>

            {/* Quick Role Switcher Pills */}
            <div className="flex items-center gap-1 bg-white/70 p-0.5 rounded-xl border border-[#E8DBCB] shadow-2xs">
              <button
                onClick={() => setActiveRole('customer')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  activeRole === 'customer'
                    ? 'bg-[#2C1810] text-[#FAF7F2] font-semibold shadow-xs scale-102'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
                title="Mode Pelanggan: Pesan Kopi & Sedekah Sukarela"
              >
                <User className="h-3 w-3" />
                <span>Pelanggan</span>
              </button>

              <button
                onClick={() => setActiveRole('operator')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  activeRole === 'operator'
                    ? 'bg-[#8E5230] text-white font-semibold shadow-xs scale-102'
                    : 'text-gray-600 hover:text-[#8E5230] hover:bg-black/5'
                }`}
                title="Mode Operator: Barista, Kasir POS & Biaya"
              >
                <Coffee className="h-3 w-3 text-amber-300" />
                <span>Operator</span>
              </button>

              <button
                onClick={() => setActiveRole('takmir')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  activeRole === 'takmir'
                    ? 'bg-[#2D5A43] text-white font-semibold shadow-xs scale-102'
                    : 'text-gray-600 hover:text-[#2D5A43] hover:bg-black/5'
                }`}
                title="Mode Takmir: Mudharabah 60:40 & Audit Sedekah"
              >
                <Building2 className="h-3 w-3 text-emerald-300" />
                <span>Takmir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Glass Navbar */}
        <div className="border-b border-[#E8DBCB]/70 bg-[#FAF7F2]/90 backdrop-blur-md shadow-2xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            
            {/* Brand Logo & Tagline */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2C1810] to-[#170B06] text-amber-300 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-900/20">
                <Coffee className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2D5A43] text-[9px] font-bold text-white ring-2 ring-[#FAF7F2]">
                  ✓
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xl font-bold tracking-tight text-[#2C1810] group-hover:text-[#8E5230] transition-colors">
                    SEDUH BERKAH
                  </span>
                </div>
                <span className="block text-[10px] font-semibold tracking-wider text-[#8E5230] uppercase">
                  Robusta Bengkulu • Masjid Kampus UNIB
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#F5EFE6]/70 p-1.5 rounded-2xl border border-[#E8DBCB]/80">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                        : 'text-gray-700 hover:text-[#2C1810] hover:bg-white/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          isActive
                            ? 'bg-amber-400 text-[#2C1810]'
                            : 'bg-[#2D5A43]/15 text-[#2D5A43]'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Quick links to active role dashboard */}
              {activeRole === 'operator' && (
                <Link
                  href="/operator"
                  className="flex items-center gap-1.5 rounded-xl bg-[#8E5230] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#724024] transition-all"
                >
                  <Coffee className="h-3.5 w-3.5 text-amber-200" />
                  <span>Panel Kasir</span>
                </Link>
              )}

              {activeRole === 'takmir' && (
                <Link
                  href="/takmir"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2D5A43] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#20402E] transition-all"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
                  <span>Panel Takmir</span>
                </Link>
              )}
            </nav>

            {/* Right Action Icons: Auth & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 border-r border-[#E8DBCB] pr-3">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-[#2C1810]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-gray-500 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-gray-500 hover:text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                    title="Keluar Akun"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/masuk"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#E8DBCB] bg-white px-3.5 py-2 text-xs font-semibold text-gray-800 hover:bg-[#F6EFE6] transition-all shadow-2xs"
                >
                  <LogIn className="h-3.5 w-3.5 text-[#8E5230]" />
                  <span>Masuk</span>
                </Link>
              )}

              {/* Cart Button with Glow and Ripple Feel */}
              <Link
                href="/keranjang"
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-sm ${
                  totalPortionsInCart > 0
                    ? 'bg-gradient-to-r from-[#2C1810] to-[#3D2314] text-white ring-2 ring-amber-400/50 glow-subtle'
                    : 'bg-[#2C1810] text-[#FAF7F2] hover:bg-[#3D2314]'
                }`}
              >
                <ShoppingBag className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">Keranjang</span>
                {totalPortionsInCart > 0 && (
                  <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-[#2C1810] shadow-xs animate-bounce">
                    {totalPortionsInCart}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8DBCB] bg-white text-gray-700 shadow-2xs"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E8DBCB] bg-[#FAF7F2] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1 text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 font-semibold transition-colors ${
                    pathname === link.href
                      ? 'bg-[#2C1810] text-white'
                      : 'text-gray-700 hover:bg-[#F6EFE6]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-amber-400/20 text-[#8E5230] px-2 py-0.5 text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {activeRole === 'operator' && (
                <Link
                  href="/operator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-[#8E5230] text-white px-3.5 py-2.5 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    Panel Kasir / Barista
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {activeRole === 'takmir' && (
                <Link
                  href="/takmir"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-[#2D5A43] text-white px-3.5 py-2.5 font-bold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Panel Pengawasan Takmir
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </nav>

            {!currentUser && (
              <div className="pt-2 border-t border-[#E8DBCB]">
                <Link
                  href="/masuk"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-white border border-[#E8DBCB] py-2.5 text-xs font-bold text-gray-800"
                >
                  <LogIn className="h-4 w-4 text-[#8E5230]" />
                  <span>Masuk Akun</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile (Ergonomic Thumb Comfort) */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-50 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-white/40 bg-[#1F1109]/90 backdrop-blur-lg p-1.5 shadow-2xl text-white flex items-center justify-around">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              pathname === '/' ? 'text-amber-300 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span className="text-[10px]">Beranda</span>
          </Link>

          <Link
            href="/menu"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              pathname === '/menu' ? 'text-amber-300 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <Coffee className="h-4 w-4" />
            <span className="text-[10px]">6 Menu</span>
          </Link>

          <Link
            href="/keranjang"
            className={`relative flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all ${
              pathname === '/keranjang' ? 'text-amber-300 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              {totalPortionsInCart > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-[#2C1810]">
                  {totalPortionsInCart}
                </span>
              )}
            </div>
            <span className="text-[10px]">Keranjang</span>
          </Link>

          <Link
            href="/pesanan"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              pathname === '/pesanan' ? 'text-amber-300 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="text-[10px]">Antrean</span>
          </Link>

          <Link
            href="/transparansi"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              pathname === '/transparansi' ? 'text-emerald-300 font-bold bg-white/10' : 'text-white/70 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px]">Sedekah</span>
          </Link>
        </div>
      </div>
    </>
  );
}
