'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCategory } from '@/types';
import { Coffee, Sparkles, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function MenuCatalogPage() {
  const { products, totalPortionsInCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showHpp, setShowHpp] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Semua Menu', count: products.length },
    { id: 'kopi-robusta', label: 'Kopi Robusta', count: products.filter((p) => p.category === 'kopi-robusta').length },
    { id: 'non-kopi', label: 'Non-Kopi', count: products.filter((p) => p.category === 'non-kopi').length },
    { id: 'teh', label: 'Teh Segar', count: products.filter((p) => p.category === 'teh').length },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-10 sm:py-16 bg-[#FDFBF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8DBCB]">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E5230] uppercase tracking-wider">
              <Coffee className="h-3.5 w-3.5" />
              <span>Katalog Resmi Kedai</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Menu Pilihan Seduh Berkah
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Enam racikan minuman andalan berbasis biji Robusta asli Bengkulu dan pilihan segar non-kopi. Dibuat langsung oleh barista mahasiswa dengan harga terjangkau.
            </p>
          </div>

          {/* Educational HPP Toggle & Cart CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowHpp(!showHpp)}
              className="flex items-center gap-1.5 rounded-xl border border-[#E8DBCB] bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              title="Transparansi biaya bahan baku per porsi sesuai rancangan bisnis"
            >
              {showHpp ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                  <span>Sembunyikan HPP</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-[#2D5A43]" />
                  <span>Tampilkan Transparansi HPP</span>
                </>
              )}
            </button>

            {totalPortionsInCart > 0 && (
              <Link
                href="/keranjang"
                className="flex items-center gap-2 rounded-xl bg-[#2C1810] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#8E5230] transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Lihat Keranjang ({totalPortionsInCart})</span>
              </Link>
            )}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#2C1810] text-[#FDFBF7] shadow-sm font-semibold'
                  : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EBE1]'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showHpp={showHpp} />
          ))}
        </div>

        {/* Notice Info Box */}
        <div className="mt-14 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-[#2C1810]">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Sistem Pemesanan Pre-Order Cepat &amp; Cash-on-Pickup
            </span>
            <p className="text-gray-700">
              Pesan melalui web saat jam kuliah atau istirahat, lalu datang ke serambi Masjid Kampus UNIB untuk mengambil pesanan dan membayar tunai di kasir tanpa mengantre.
            </p>
          </div>

          <Link
            href="/keranjang"
            className="shrink-0 rounded-xl bg-[#2C1810] px-4 py-2 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors"
          >
            Lanjut ke Keranjang
          </Link>
        </div>
      </div>
    </div>
  );
}
