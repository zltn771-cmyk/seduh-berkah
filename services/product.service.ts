import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';

export async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient();
  if (!supabase) {
    return INITIAL_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Supabase products empty or error, using mock fallback:', error?.message);
      return INITIAL_PRODUCTS;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.price >= 10000 && item.name.includes('Robusta') ? 'kopi-robusta' : item.name.includes('Teh') ? 'teh' : item.name.includes('Cokelat') ? 'non-kopi' : 'kopi-robusta',
      categoryLabel: item.name.includes('Teh') ? 'Teh Segar' : item.name.includes('Cokelat') ? 'Non-Kopi' : 'Kopi Robusta',
      price: Number(item.price),
      hpp: Number(item.hpp),
      description: item.description || '',
      isAvailable: Boolean(item.is_available),
      image: item.image_url || '/images/kopi-hitam.svg',
      tag: item.name.includes('Aren') ? 'Terlaris ★' : undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch from Supabase, returning mock:', err);
    return INITIAL_PRODUCTS;
  }
}
