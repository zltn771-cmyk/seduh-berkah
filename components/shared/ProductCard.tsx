'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useApp } from '@/lib/context';
import { Plus, Check, Sparkles, HeartHandshake, Coffee } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showHpp?: boolean;
}

export function ProductCard({ product, showHpp = false }: ProductCardProps) {
  const { addToCart, cart } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  // Check if item is already in cart
  const itemInCart = cart.find((item) => item.product.id === product.id);
  const currentQuantityInCart = itemInCart?.quantity || 0;

  const handleAdd = () => {
    if (!product.isAvailable) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  // Aesthetic flavor notes mapping based on product
  const flavorNotes: Record<string, string[]> = {
    'prod-1': ['Hitam Pekat', 'Low Acidity', 'Aroma Biji Panggang'],
    'prod-2': ['Aren Curup', 'Susu Segar', 'Karamel Legit'],
    'prod-3': ['Double Shot', 'Espresso Dingin', 'Ekstra Segar'],
    'prod-4': ['Microfoam Halus', 'Hangat Menenangkan', 'Creamy Lembut'],
    'prod-5': ['Cokelat Belgia', 'Kaya Antioksidan', 'Non-Coffee'],
    'prod-6': ['Lemon Asli', 'Madu Alami', 'Melepas Dahaga'],
  };

  const notes = flavorNotes[product.id] || ['Bahan Alami', 'Diracik Segar'];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E8DBCB]/80 bg-white shadow-xs card-hover-lift">
      <div>
        {/* Visual Showcase Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#2C1810] to-[#170B06]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Subtle gradient overlay on bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

          {/* Badge Tag */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.tag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2D5A43]/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/20">
                <Sparkles className="h-2.5 w-2.5 text-amber-300" />
                {product.tag}
              </span>
            )}
          </div>

          {/* Sedekah Benefit Pill on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-amber-200 border border-white/10">
              <HeartHandshake className="h-3 w-3 text-amber-300" />
              Opsi Sedekah Rp1.000
            </span>

            {currentQuantityInCart > 0 && (
              <span className="rounded-full bg-amber-400 text-[#2C1810] px-2 py-0.5 text-[10px] font-black shadow-sm">
                {currentQuantityInCart} di keranjang
              </span>
            )}
          </div>

          {/* Stock Out Overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-xs">
              <span className="rounded-full bg-red-600/90 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                Stok Habis Sementara
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold tracking-wider uppercase text-[#8E5230] text-[10px]">
              {product.categoryLabel}
            </span>
            {showHpp && (
              <span
                className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#8E5230] border border-amber-200"
                title="Harga Pokok Penjualan Bahan Baku Terhitung"
              >
                HPP: {formatRupiah(product.hpp)}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1810] group-hover:text-[#8E5230] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Flavor Notes Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {notes.map((note, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-[#FAF7F2] border border-[#E8DBCB]/70 px-2 py-0.5 text-[10px] font-medium text-gray-600"
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Price & Interactive Button */}
      <div className="flex items-center justify-between border-t border-[#F5EFE6] bg-[#FAF7F2]/60 p-4 sm:p-5">
        <div>
          <span className="block text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
            Harga Cangkir
          </span>
          <span className="font-serif text-xl font-black text-[#2C1810]">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.isAvailable}
          className={`group/btn relative flex items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
            justAdded
              ? 'bg-[#2D5A43] text-white shadow-emerald-800/30 ring-2 ring-[#2D5A43]'
              : product.isAvailable
              ? 'bg-[#2C1810] text-[#FAF7F2] hover:bg-[#8E5230] hover:shadow-md'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
          title="Tambahkan ke Keranjang Pesanan"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4 animate-scale-up" />
              <span>Ditambahkan!</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 transition-transform group-hover/btn:rotate-90 duration-300" />
              <span>{currentQuantityInCart > 0 ? '+ Tambah' : 'Pesan'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
