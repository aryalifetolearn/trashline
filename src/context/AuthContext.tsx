'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  badge: string;
  district?: string;
  role?: 'warga' | 'operator' | 'admin';
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsDemo: (role: 'warga' | 'operator' | 'admin', name?: string, email?: string, district?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  loginAsDemo: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchProfile(userId: string, currentUser?: User | null) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback profile if record not yet created in table
        const fallbackName = (currentUser || user)?.user_metadata?.name || 
                             (currentUser || user)?.email?.split('@')[0] || 
                             'Warga Cirebon';
        setProfile({
          id: userId,
          name: fallbackName,
          badge: 'Pemula Hijau',
          role: 'warga'
        });
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
          setLoading(false);
          return;
        }

        // Check local demo session
        const savedDemo = localStorage.getItem('trashline_demo_user');
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (err) {
        console.warn('Auth session init:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      } else {
        // If not a demo session, clear
        const savedDemo = localStorage.getItem('trashline_demo_user');
        if (!savedDemo) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginAsDemo = (role: 'warga' | 'operator' | 'admin', customName?: string, customEmail?: string, customDistrict?: string) => {
    let name = customName;
    let email = customEmail;
    let district = customDistrict;
    let badge = 'Pemula Hijau';
    let id = 'demo-warga-cirebon';

    if (role === 'admin') {
      name = name || 'Bpk. Rahmat Hidayat (Pengawas DLH)';
      email = email || 'admin.dlh@trashline.id';
      district = district || 'Kota/Kab. Cirebon';
      badge = 'Administrator Pengawas DLH';
      id = 'demo-admin-dlh-cirebon';
    } else if (role === 'operator') {
      name = name || 'Kang Suryadi (Petugas BSI Dewi Sri)';
      email = email || 'petugas.bsi@trashline.id';
      district = district || 'Kec. Dukupuntang';
      badge = 'Verifikator Timbang Mitra';
      id = 'demo-operator-cirebon';
    } else {
      name = name || 'Ibu Siti Aminah (RW 03 Harjamukti)';
      email = email || 'siti.aminah@trashline.id';
      district = district || 'Kec. Harjamukti';
      badge = 'Pejuang Daur Ulang';
      id = 'demo-warga-cirebon';
    }

    const mockUser: any = {
      id,
      email,
      user_metadata: { name, district }
    };

    const mockProfile: UserProfile = {
      id,
      name,
      badge,
      district,
      role
    };

    localStorage.setItem('trashline_demo_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
    setUser(mockUser);
    setProfile(mockProfile);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('trashline_demo_user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && !user.id.startsWith('demo-')) {
      await fetchProfile(user.id, user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
