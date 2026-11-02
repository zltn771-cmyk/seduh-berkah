'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context';
import { ProductCard } from '@/components/shared/ProductCard';
import { Coffee, Sparkles, Eye, EyeOff, ShoppingBag, Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MenuCatalogPage() {
  const { products, totalPortionsInCart, totalPaymentInCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHpp, setShowHpp] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Semua Menu', count: products.length },
    { id: 'kopi-robusta', label: 'Kopi Robusta', count: products.filter((p) => p.category === 'kopi-robusta').length },
    { id: 'non-kopi', label: 'Non-Kopi', count: products.filter((p) => p.category === 'non-kopi').length },
    { id: 'teh', label: 'Teh Segar', count: products.filter((p) => p.category === 'teh').length },
  ];

  // Combined Category & Search Filter
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-10 sm:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="rounded-3xl border border-[#E8DBCB] bg-gradient-to-r from-white via-[#FDFBF7] to-[#F5EFE6] p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8DBCB]/70">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E5230] uppercase tracking-wider">
                <Coffee className="h-4 w-4" />
                <span>Katalog Resmi 6 Menu Kedai</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
                Cita Rasa Robusta Bengkulu
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Diracik langsung dari biji Robusta asli perkebunan Kepahiang &amp; Rejang Lebong. Harga bersahabat bagi mahasiswa, dosen, dan jamaah masjid kampus.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowHpp(!showHpp)}
                className="flex items-center gap-2 rounded-2xl border border-[#E8DBCB] bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#F6EFE6] transition-all shadow-2xs"
                title="Transparansi biaya bahan baku per cangkir"
              >
                {showHpp ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                    <span>Sembunyikan HPP</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 text-[#2D5A43]" />
                    <span>Transparansi HPP Bahan</span>
                  </>
                )}
              </button>

              {totalPortionsInCart > 0 && (
                <Link
                  href="/keranjang"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#2C1810] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#3E2316] transition-all"
                >
                  <ShoppingBag className="h-4 w-4 text-amber-300" />
                  <span>Keranjang ({totalPortionsInCart} porsi)</span>
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kopi, susu gula aren, cokelat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E8DBCB] bg-white py-2.5 pl-10 pr-4 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E5230]/30 shadow-2xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#2C1810] text-[#FAF7F2] shadow-xs'
                      : 'bg-white border border-[#E8DBCB] text-gray-700 hover:bg-[#F5EFE6]'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-[#E8DBCB] bg-white p-12 text-center space-y-3">
            <Coffee className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-gray-800">Menu Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500">
              Tidak ada menu yang sesuai dengan kata kunci &quot;{searchQuery}&quot;. Coba cari kata kunci lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showHpp={showHpp} />
            ))}
          </div>
        )}

        {/* Bottom Ordering Info Card */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/60 p-6 sm:p-8 text-xs text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1.5 max-w-2xl">
            <span className="font-bold flex items-center gap-2 text-[#2C1810] text-sm">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Alur Pre-Order Praktis (Cash-on-Pickup)
            </span>
            <p className="text-gray-700 leading-relaxed">
              Pesan secara daring saat jam istirahat atau sebelum kuliah selesai. Minuman Anda akan disiapkan oleh barista mahasiswa sehingga Anda dapat langsung mengambil dan membayar tunai di serambi Masjid Kampus UNIB tanpa antre panjang.
            </p>
          </div>

          <Link
            href="/keranjang"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-[#2C1810] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#8E5230] transition-colors shadow-sm"
          >
            <span>Lanjut ke Keranjang</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
