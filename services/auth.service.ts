import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types';

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export async function signUpCustomer(
  email: string,
  pass: string,
  fullName: string,
  phone?: string
): Promise<{ user: any; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return { user: { id: `mock-${Date.now()}`, email }, error: undefined };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: fullName,
        phone: phone || '',
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: undefined };
}

export async function signInUser(
  email: string,
  pass: string
): Promise<{ user: any; profile?: UserProfile; error?: string }> {
  const supabase = createClient();
  if (!supabase) {
    return {
      user: { id: 'mock-user', email },
      profile: {
        id: 'mock-user',
        email,
        fullName: email.split('@')[0],
        role: email.includes('takmir') ? 'takmir' : email.includes('operator') ? 'operator' : 'customer',
      },
      error: undefined,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error || !data.user) {
    return { user: null, error: error?.message || 'Login gagal' };
  }

  // Fetch role from profiles
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', data.user.id)
    .single();

  const profile: UserProfile = {
    id: data.user.id,
    email: data.user.email,
    fullName: profileData?.full_name || 'Pengguna',
    phone: profileData?.phone || '',
    role: (profileData?.role as UserRole) || 'customer',
  };

  return { user: data.user, profile, error: undefined };
}

export async function signOutUser(): Promise<void> {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function fetchCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    fullName: profileData?.full_name || 'Pengguna',
    phone: profileData?.phone || '',
    role: (profileData?.role as UserRole) || 'customer',
  };
}
