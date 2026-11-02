'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useApp } from '@/lib/context';
import { Plus, Check, Coffee } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showHpp?: boolean;
}

export function ProductCard({ product, showHpp = false }: ProductCardProps) {
  const { addToCart } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (!product.isAvailable) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8DBCB]/70 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#8E5230]/40">
      <div>
        {/* Visual Header */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2C1810]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.tag && (
            <span className="absolute top-3 left-3 rounded-full bg-[#2D5A43] px-2.5 py-0.5 text-[11px] font-semibold text-[#FDFBF7] shadow-sm">
              {product.tag}
            </span>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              <span className="rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white">
                Stok Habis Sementara
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-[#8E5230]">
            <span className="font-medium tracking-wide">{product.categoryLabel}</span>
            {showHpp && (
              <span className="text-[11px] text-gray-500" title="Harga Pokok Penjualan (Bahan Baku)">
                HPP: {formatRupiah(product.hpp)}
              </span>
            )}
          </div>

          <h3 className="mt-1 font-serif text-lg font-bold text-[#2C1810] group-hover:text-[#8E5230] transition-colors">
            {product.name}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="flex items-center justify-between border-t border-[#F5EBE1] bg-[#FDFBF7] p-4 sm:p-5">
        <div>
          <span className="block text-[11px] text-gray-500">Harga Kedai</span>
          <span className="font-serif text-lg font-bold text-[#2C1810]">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.isAvailable}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            justAdded
              ? 'bg-[#2D5A43] text-white shadow-sm'
              : product.isAvailable
              ? 'bg-[#2C1810] text-[#FDFBF7] hover:bg-[#8E5230] active:scale-95 shadow-sm'
              : 'cursor-not-allowed bg-gray-200 text-gray-400'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Ditambahkan</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Pesan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
