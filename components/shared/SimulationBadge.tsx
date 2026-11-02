import React from 'react';

interface SimulationBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
}

export function SimulationBadge({ label = 'DATA SIMULASI', size = 'sm' }: SimulationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border border-amber-300/40 bg-amber-500/15 text-amber-800 dark:text-amber-200 uppercase tracking-wider ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
      title="Data ini disajikan sebagai simulasi ilustratif sesuai rancangan bisnis dan bukan transaksi aktual."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
      {label}
    </span>
  );
}
