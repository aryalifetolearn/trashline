'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  Leaf
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, signOut, loginAsDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Kec. Dukupuntang');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const districts = [
    'Kec. Dukupuntang (Kab. Cirebon)',
    'Kec. Sumber (Kab. Cirebon)',
    'Kec. Harjamukti (Kota Cirebon)',
    'Kec. Pekalipan (Kota Cirebon)',
    'Kec. Kesambi (Kota Cirebon)',
    'Kec. Kejaksan (Kota Cirebon)',
    'Kec. Lemahwungkuk (Kota Cirebon)',
    'Wilayah Cirebon Lainnya'
  ];

  const handleInstantDemo = (role: 'warga' | 'operator' | 'admin') => {
    loginAsDemo(role);
    if (role === 'admin') {
      setSuccessMessage('Berhasil masuk sebagai Admin Pengawas DLH! Mengalihkan ke Dasbor Kurasi...');
      setTimeout(() => router.push('/admin'), 700);
    } else if (role === 'operator') {
      setSuccessMessage('Berhasil masuk sebagai Petugas Mitra Timbang BSI! Mengalihkan ke Dasbor Admin...');
      setTimeout(() => router.push('/admin'), 700);
    } else {
      setSuccessMessage('Berhasil masuk sebagai Warga Cirebon! Mengalihkan ke Forum Komunitas...');
      setTimeout(() => router.push('/forum'), 700);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            // Berikan fallback cerdas agar evaluator juri tidak terhambat
            setErrorMessage('Email belum dikonfirmasi di inbox. Untuk keperluan pengetesan juri/lomba, Anda dapat menggunakan tombol "Akses Uji Coba Cepat (Evaluator Juri)" di bawah.');
            setLoading(false);
            return;
          }
          throw error;
        }

        setSuccessMessage('Berhasil masuk! Mengalihkan ke beranda...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // Mode Register
        if (!fullName.trim()) {
          throw new Error('Nama lengkap wajib diisi');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: fullName.trim(),
              district: district
            }
          }
        });

        if (error) {
          throw error;
        }

        // Simpan profil awal ke tabel profiles jika user terbuat
        if (data.user) {
          try {
            await supabase.from('profiles').insert([{
              id: data.user.id,
              name: fullName.trim(),
              badge: 'Pemula Hijau'
            }]);
          } catch {
            // ignore if trigger handles it
          }
        }

        // Jika Supabase membutuhkan konfirmasi email
        if (!data.session) {
          setSuccessMessage('Akun berhasil dibuat! Silakan verifikasi tautan di email Anda, atau gunakan akses instan demo untuk melanjutkan pengujian sekarang.');
        } else {
          setSuccessMessage('Pendaftaran berhasil! Akun warga Anda telah aktif di Trashline.');
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk kemudahan demonstrasi juri
  const fillDemoAccount = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('trashline2026');
    setFullName(demoName);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8 text-[#171916] dark:text-[#F0F2EE]">
      <Breadcrumb items={[{ label: mode === 'login' ? 'Masuk Akun' : 'Daftar Warga' }]} />

      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header Kartu */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#D8ED78] shadow-xs mb-1">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE]">
            {mode === 'login' ? 'Masuk ke Trashline' : 'Daftar Akun Warga'}
          </h1>
          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8]">
            {mode === 'login' 
              ? 'Kelola aksi sirkular, kumpulkan lencana penghargaan, dan pantau peringkat wilayah Anda.' 
              : 'Bergabung dalam gerakan pemilahan sampah plastik terpadu Cirebon.'}
          </p>
        </div>

        {/* Jika User Sudah Login */}
        {user ? (
          <div className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#5C7D43] text-white flex items-center justify-center mx-auto text-lg font-bold">
              {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7D43] dark:text-[#84A964]">
                Akun Sedang Aktif
              </span>
              <h3 className="font-bold text-base text-[#171916] dark:text-[#F0F2EE]">
                {profile?.name || user.email}
              </h3>
              <p className="text-xs text-[#777A73]">{user.email}</p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/peringkat"
                className="w-full py-2.5 rounded-full bg-[#5C7D43] text-white font-semibold text-xs hover:bg-[#4E6C38] transition-all"
              >
                Lihat Profil & Lencana
              </Link>
              <button
                onClick={signOut}
                className="w-full py-2.5 rounded-full border border-[#E5E6DF] dark:border-[#2C322C] text-[#777A73] hover:text-red-500 text-xs font-semibold transition-all"
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-full bg-[#F1F2EE] dark:bg-[#121412] p-1 border border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#1E221E] text-[#171916] dark:text-[#F0F2EE] shadow-xs'
                    : 'text-[#777A73] dark:text-[#A6AFA8]'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#1E221E] text-[#171916] dark:text-[#F0F2EE] shadow-xs'
                    : 'text-[#777A73] dark:text-[#A6AFA8]'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* Alert Error / Success */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleAuth} className="space-y-4 text-xs">
              
              {mode === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                      Nama Lengkap Warga
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#777A73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Siti Aminah"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] focus:outline-none focus:border-[#5C7D43]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                      Wilayah Domisili Cirebon
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#777A73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] focus:outline-none focus:border-[#5C7D43]"
                      >
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777A73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] focus:outline-none focus:border-[#5C7D43]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#777A73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] focus:outline-none focus:border-[#5C7D43]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Warga'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Helper untuk Panitia / Juri */}
            <div className="pt-4 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#777A73]">
                <span>🧪 Simulasi 3 Peran Evaluator Juri:</span>
                <span className="text-[10px] text-[#5C7D43] font-bold">1-Klik Langsung Aktif</span>
              </div>
              <div className="space-y-2">
                {/* 1. Akun Warga */}
                <button
                  type="button"
                  onClick={() => handleInstantDemo('warga')}
                  className="w-full p-3 rounded-2xl border border-[#5C7D43]/30 hover:border-[#5C7D43] bg-[#5C7D43]/5 hover:bg-[#5C7D43]/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C7D43] dark:text-[#84A964]">
                      1. Peran Warga (Nasabah)
                    </span>
                    <strong className="block text-xs text-[#171916] dark:text-[#F0F2EE] group-hover:text-[#5C7D43]">
                      Ibu Siti Aminah (RW 03 Harjamukti)
                    </strong>
                    <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                      Aksi sirkular, unggah ide & komentar di Forum, pantau lencana pribadi.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#5C7D43] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Masuk &rarr;
                  </span>
                </button>

                {/* 2. Akun Petugas Mitra */}
                <button
                  type="button"
                  onClick={() => handleInstantDemo('operator')}
                  className="w-full p-3 rounded-2xl border border-[#5C7D43]/30 hover:border-[#5C7D43] bg-[#5C7D43]/5 hover:bg-[#5C7D43]/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C7D43] dark:text-[#84A964]">
                      2. Peran Petugas Timbang Mitra
                    </span>
                    <strong className="block text-xs text-[#171916] dark:text-[#F0F2EE] group-hover:text-[#5C7D43]">
                      Kang Suryadi (BSI Dewi Sri Girinata)
                    </strong>
                    <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                      Input dan validasi timbangan sah lapangan sesuai 7 kode resin.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#5C7D43] shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Masuk &rarr;
                  </span>
                </button>

                {/* 3. Akun Admin Pengawas DLH */}
                <button
                  type="button"
                  onClick={() => handleInstantDemo('admin')}
                  className="w-full p-3 rounded-2xl border border-amber-500/30 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                      3. Peran Administrator Pengawas DLH
                    </span>
                    <strong className="block text-xs text-[#171916] dark:text-[#F0F2EE] group-hover:text-amber-600">
                      Bpk. Rahmat Hidayat (Dinas Lingkungan Hidup)
                    </strong>
                    <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                      Kurasi & persetujuan bank sampah baru di peta, cabut kemitraan & hapus timbangan keliru.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Masuk &rarr;
                  </span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
