'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/keranjang');
  }, [router]);

  return (
    <div className="py-20 text-center text-xs text-gray-500">
      Mengalihkan ke halaman pemesanan...
    </div>
  );
}
