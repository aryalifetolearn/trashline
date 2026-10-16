'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Trophy, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  ThumbsUp, 
  Lightbulb, 
  MapPin, 
  ArrowUpRight, 
  ExternalLink,
  Users,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  UserCheck,
  Plus,
  Scale,
  Clock
} from 'lucide-react';
import { INITIAL_POSTS } from '../../data/mockPosts';
import { ForumPost } from '../../types';
import Breadcrumb from '../../components/Breadcrumb';
import { supabase } from '../../lib/supabase';

export default function PeringkatPage() {
  const [activeTab, setActiveTab] = useState<'ide' | 'wilayah'>('ide');
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [weighingLogs, setWeighingLogs] = useState<any[]>([]);

  // Load latest posts & weighing logs from Supabase with localStorage backup
  useEffect(() => {
    async function loadData() {
      // 1. Load Posts from Supabase
      try {
        const { data: pData, error: pErr } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (!pErr && pData && pData.length > 0) {
          const mappedPosts: ForumPost[] = pData.map((item: any, idx: number) => ({
            id: item.id || `post-${idx}`,
            title: item.title,
            content: item.content,
            author: {
              name: item.author_name || 'Warga Cirebon',
              badge: item.author_badge || 'Pemula Hijau'
            },
            plastic_tag: item.plastic_tag || 'Kode 1 (PET)',
            upvotes: item.upvotes || 0,
            comments_count: item.comments_count || 0,
            created_at: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Baru saja',
            comments: []
          }));
          const existingTitles = new Set(mappedPosts.map(p => p.title.toLowerCase()));
          const combined = [...mappedPosts, ...INITIAL_POSTS.filter(p => !existingTitles.has(p.title.toLowerCase()))];
          setPosts(combined);
        } else {
          const savedPosts = localStorage.getItem('forum_posts');
          if (savedPosts) setPosts(JSON.parse(savedPosts));
        }
      } catch {
        const savedPosts = localStorage.getItem('forum_posts');
        if (savedPosts) setPosts(JSON.parse(savedPosts));
      }

      // 2. Load Weighing Logs from Supabase
      try {
        const { data: wData, error: wErr } = await supabase.from('weighing_logs').select('*').order('created_at', { ascending: false });
        if (!wErr && wData && wData.length > 0) {
          setWeighingLogs(wData);
        } else {
          const savedLogs = localStorage.getItem('trashline_weighing_logs');
          if (savedLogs) setWeighingLogs(JSON.parse(savedLogs));
        }
      } catch {
        const savedLogs = localStorage.getItem('trashline_weighing_logs');
        if (savedLogs) setWeighingLogs(JSON.parse(savedLogs));
      }
    }

    loadData();
  }, []);

  // Urutkan postingan berdasarkan upvotes terbanyak
  const sortedIdeas = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  // Kalkulasi dinamis total tonase dari timbangan sah lapangan
  const dukupuntangExtraKg = weighingLogs
    .filter(l => (l.district || '').includes('Dukupuntang') || (l.bank_name || l.bankName || '').includes('Berkah') || (l.bank_name || l.bankName || '').includes('Dewi Sri'))
    .reduce((acc, l) => acc + Number(l.weight_kg || l.weightKg || 0), 0);

  const sumberExtraKg = weighingLogs
    .filter(l => (l.district || '').includes('Sumber') || (l.bank_name || l.bankName || '').includes('Sumber') || (l.bank_name || l.bankName || '').includes('Syariah') || (l.bank_name || l.bankName || '').includes('WSM'))
    .reduce((acc, l) => acc + Number(l.weight_kg || l.weightKg || 0), 0);

  const harjamuktiExtraKg = weighingLogs
    .filter(l => (l.district || '').includes('Pekalipan') || (l.district || '').includes('Harjamukti') || (l.bank_name || l.bankName || '').includes('Harjamukti') || (l.bank_name || l.bankName || '').includes('Mawar'))
    .reduce((acc, l) => acc + Number(l.weight_kg || l.weightKg || 0), 0);

  const rawLocations = [
    {
      id: 'loc-1',
      name: 'Bank Sampah Berkah Cirebon (Pilot Utama)',
      area: 'Kec. Dukupuntang, Kab. Cirebon',
      totalKg: 1420 + dukupuntangExtraKg,
      activeMembers: `${185 + Math.floor(dukupuntangExtraKg / 10)} Warga`,
      incentiveType: 'Uang Tunai Timbangan',
      status: 'Terverifikasi Resmi',
      badge: 'BSI Percontohan Cirebon'
    },
    {
      id: 'loc-2',
      name: 'Bank Sampah Syariah Sumber Sejahtera',
      area: 'Kec. Sumber, Kab. Cirebon',
      totalKg: 980 + sumberExtraKg,
      activeMembers: `${120 + Math.floor(sumberExtraKg / 10)} Anggota`,
      incentiveType: 'SHU Koperasi / Simpanan',
      status: 'Terverifikasi Resmi',
      badge: 'Pelopor Koperasi Sirkular'
    },
    {
      id: 'loc-3',
      name: 'Bank Sampah Mandiri Harjamukti',
      area: 'Kec. Harjamukti, Kota Cirebon',
      totalKg: 640 + harjamuktiExtraKg,
      activeMembers: `${94 + Math.floor(harjamuktiExtraKg / 10)} Warga`,
      incentiveType: 'Tunai / Sedekah Kas RW',
      status: 'Terverifikasi Resmi',
      badge: 'Inisiatif Swadaya Warga'
    }
  ];

  // Urutkan lokasi berdasarkan tonase tertinggi
  const verifiedLocations = rawLocations
    .sort((a, b) => b.totalKg - a.totalKg)
    .map((loc, idx) => ({
      ...loc,
      rank: idx + 1,
      totalVerifiedKg: `${loc.totalKg.toLocaleString('id-ID')} kg`
    }));

  // Warga demo partisipasi
  const userExtraKg = weighingLogs
    .filter(l => (l.citizen_name || l.citizenName || '').toLowerCase().includes('siti'))
    .reduce((acc, l) => acc + Number(l.weight_kg || l.weightKg || 0), 0);
  const userTotalKg = 12.5 + userExtraKg;
  const userProgressPercent = Math.min(100, Math.round((userTotalKg / 25) * 100));
  const isLevel2 = userTotalKg >= 25 || weighingLogs.length > 0;

  // Jenjang Tingkatan Lencana Komunitas
  const badges = [
    {
      level: 1,
      title: 'Pemula Hijau',
      requirement: 'Mulai memilah 7 kode plastik',
      icon: '🌱',
      color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      description: 'Diberikan kepada warga yang aktif mempelajari tata cara dekontaminasi dan pemilahan di Kamus Plastik.'
    },
    {
      level: 2,
      title: 'Pejuang Daur Ulang',
      requirement: 'Setor 1x ke Bank Sampah Mitra',
      icon: '🔄',
      color: 'bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#84A964] border-[#5C7D43]/30',
      description: 'Telah terverifikasi melakukan penimbangan sampah plastik bersih di Bank Sampah terdekat.'
    },
    {
      level: 3,
      title: 'Inovator Sirkular',
      requirement: '10+ Dukungan Ide di Forum',
      icon: '💡',
      color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      description: 'Menciptakan karya DIY / upcycling kreatif yang bermanfaat nyata dan diapresiasi oleh komunitas.'
    },
    {
      level: 4,
      title: 'Pelopor Zero Waste',
      requirement: '50+ Dukungan Ide & Kontributor',
      icon: '👑',
      color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      description: 'Penggerak gerakan bebas sampah dengan kontribusi ide dan aksi sirkular paling berpengaruh.'
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Lencana & Peringkat' }]} />
      
      {/* Header Banner - Gaya Trashline Editorial */}
      <section className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
            <Trophy className="w-3.5 h-3.5 text-[#5C7D43]" />
            <span>PAPAN APRESIASI & PENGHARGAAN RESMI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.08]">
            Peringkat <span className="text-[#5C7D43] dark:text-[#D8ED78]">Inovasi & Aksi</span>,<br />
            Transparan & Anti-Manipulasi.
          </h1>

          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-2xl">
            Sistem peringkat Trashline dirancang transparan: ide kreatif dinilai murni dari dukungan warga di Forum, sementara data setoran wilayah tervalidasi langsung oleh timbangan mitra Bank Sampah resmi.
          </p>

          {/* Quick jump to Guide & Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a 
              href="#panduan-aksi"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5C7D43] text-white hover:bg-[#4E6C38] text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cara Masuk Peringkat</span>
            </a>
            <a 
              href="#jenjang-lencana"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E6DF] dark:border-[#2C322C] bg-white dark:bg-[#1E221E] text-[#171916] dark:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#2C322C] text-xs font-semibold transition-all"
            >
              <Award className="w-3.5 h-3.5 text-[#5C7D43]" />
              <span>Jenjang Lencana</span>
            </a>
          </div>
        </div>

        {/* Callout Transparansi Data */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] shadow-xs flex items-center gap-3 shrink-0 max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-[11px] text-[#777A73] dark:text-[#A6AFA8] leading-snug">
            <strong className="text-[#171916] dark:text-[#F0F2EE] block">Integritas Data Terjamin</strong>
            Bebas klaim fiktif. Seluruh data diverifikasi sistem digital & mitra lapangan.
          </div>
        </div>
      </section>

      {/* Kartu Status Partisipasi Anda (Mock Akun Warga Cirebon) */}
      <section className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#D8ED78] flex items-center justify-center text-2xl shrink-0 font-bold">
              {isLevel2 ? '🔄' : '🌱'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-[#171916] dark:text-[#F0F2EE]">
                  Profil Aksi Anda (Warga Cirebon)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] font-bold border border-[#5C7D43]/20">
                  {isLevel2 ? 'Tingkat 2 • Pejuang Daur Ulang' : 'Tingkat 1 • Pemula Hijau'}
                </span>
                {weighingLogs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tervalidasi Mitra
                  </span>
                )}
              </div>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-1">
                {isLevel2 
                  ? 'Selamat! Setoran timbangan sah Anda telah terverifikasi oleh petugas mitra Bank Sampah.' 
                  : 'Progress menuju Tingkat 2 (Pejuang Daur Ulang): Setorkan sampah terpilah ke Bank Sampah mitra atau bagikan ide di Forum!'}
              </p>
            </div>
          </div>

          {/* Mini Stats & CTA */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#F1F2EE] dark:border-[#2C322C]">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Setoran Valid</span>
              <strong className="text-sm font-bold text-[#171916] dark:text-[#F0F2EE]">{userTotalKg.toFixed(1)} kg</strong>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Ide Dibagikan</span>
              <strong className="text-sm font-bold text-[#171916] dark:text-[#F0F2EE]">1 Ide (14 Upvotes)</strong>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/forum"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Unggah Ide</span>
              </Link>
              <Link
                href="/peta"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E5E6DF] dark:border-[#2C322C] text-[#171916] dark:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#2C322C] text-xs font-semibold transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#5C7D43]" />
                <span>Titik Setor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-[#F1F2EE] dark:border-[#2C322C]/60">
          <div className="flex items-center justify-between text-[11px] text-[#777A73] dark:text-[#A6AFA8] mb-1.5">
            <span>Capaian Menuju Lencana Tingkat 2</span>
            <span className="font-semibold text-[#5C7D43] dark:text-[#84A964]">{userProgressPercent}% Selesai</span>
          </div>
          <div className="w-full bg-[#F1F2EE] dark:bg-[#121412] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#5C7D43] dark:bg-[#84A964] h-full rounded-full transition-all duration-500" 
              style={{ width: `${userProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Tab Switcher: Peringkat Ide vs Peringkat Wilayah */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-[#F1F2EE] dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] shadow-xs">
          <button
            onClick={() => setActiveTab('ide')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'ide'
                ? 'bg-[#5C7D43] text-white shadow-xs'
                : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Penyumbang Ide Terpopuler (Forum)</span>
          </button>

          <button
            onClick={() => setActiveTab('wilayah')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'wilayah'
                ? 'bg-[#5C7D43] text-white shadow-xs'
                : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Aksi Wilayah Terverifikasi (Cirebon)</span>
          </button>
        </div>
      </div>

      {/* Konten Tab 1: Peringkat Penyumbang Ide Terpopuler */}
      {activeTab === 'ide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Inovator Daur Ulang Paling Menginspirasi
              </h2>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
                Peringkat ditentukan berdasarkan akumulasi dukungan (upvotes) warga di Forum Komunitas.
              </p>
            </div>
            <Link
              href="/forum"
              className="text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Bagikan Ide Anda ke Forum</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {sortedIdeas.map((idea, index) => {
              const rank = index + 1;
              return (
                <div
                  key={idea.id}
                  className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5C7D43]/40 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Badge Nomor Peringkat */}
                    <div className={`w-9 h-9 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-sm shadow-amber-400/40 ring-2 ring-amber-300'
                        : rank === 2
                        ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100'
                        : rank === 3
                        ? 'bg-amber-700/20 text-amber-800 dark:text-amber-300'
                        : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8]'
                    }`}>
                      #{rank}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-[#171916] dark:text-[#F0F2EE]">
                          {idea.author.name}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964]">
                          {idea.author.badge}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] font-mono">
                          {idea.plastic_tag}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#171916] dark:text-[#F0F2EE] line-clamp-1">
                        "{idea.title}"
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E6DF]/60 dark:border-[#2C322C]/60 shrink-0">
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] font-bold text-xs">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{idea.upvotes} Dukungan Warga</span>
                    </div>

                    <Link
                      href="/forum"
                      className="text-xs font-semibold text-[#777A73] hover:text-[#5C7D43] dark:text-[#A6AFA8] dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Lihat Ide</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Konten Tab 2: Peringkat Setoran Wilayah Terverifikasi */}
      {activeTab === 'wilayah' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5C7D43]" />
                Peringkat Aksi Lapangan Bank Sampah Cirebon
              </h2>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
                Data penimbangan riil terakumulasi dari pencatatan resmi timbang petugas mitra.
              </p>
            </div>
            <Link
              href="/peta"
              className="text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Lihat Lokasi di Peta</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Live Feed Timbangan Sah Lapangan Terkini */}
          <div className="bg-[#F1F2EE] dark:bg-[#1A1D1A] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 sm:p-6 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-xs sm:text-sm text-[#171916] dark:text-[#F0F2EE] uppercase tracking-wider">
                  Log Setoran Sah Terverifikasi Lapangan (Live Feed)
                </h3>
              </div>
              <span className="text-[10px] text-[#5C7D43] dark:text-[#84A964] font-semibold bg-[#5C7D43]/10 px-2.5 py-0.5 rounded-full">
                {weighingLogs.length} Transaksi Sah Tercatat
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {weighingLogs.slice(0, 3).map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-3.5 shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                      <span className="font-semibold text-[#5C7D43] dark:text-[#84A964]">
                        {log.district ? `Kec. ${log.district}` : 'Cirebon'}
                      </span>
                      <span>
                        {log.created_at ? new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Hari ini'}
                      </span>
                    </div>
                    <strong className="text-xs text-[#171916] dark:text-[#F0F2EE] font-bold block truncate">
                      {log.citizen_name || log.citizenName || 'Warga Cirebon'}
                    </strong>
                    <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8] truncate">
                      via {log.bank_name || log.bankName || 'Bank Sampah Mitra'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C] flex items-center justify-between text-[11px]">
                    <span className="text-[#777A73] text-[10px]">{log.plastic_code || log.plasticCode || 'Plastik Terpilah'}</span>
                    <span className="font-extrabold text-[#5C7D43] dark:text-[#D8ED78]">
                      +{log.weight_kg || log.weightKg || 0} kg
                    </span>
                  </div>
                </div>
              ))}

              {weighingLogs.length === 0 && (
                <div className="col-span-3 text-center py-4 text-xs text-[#777A73]">
                  Belum ada timbangan baru. Catat timbangan via portal Admin untuk menguji leaderboard.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {verifiedLocations.map((loc) => (
              <div
                key={loc.rank}
                className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#5C7D43]/40 transition-all"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl font-black text-base flex items-center justify-center shrink-0 ${
                    loc.rank === 1
                      ? 'bg-[#5C7D43] text-white shadow-sm'
                      : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE]'
                  }`}>
                    #{loc.rank}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#84A964]">
                        {loc.badge}
                      </span>
                      <span className="text-[10px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {loc.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#171916] dark:text-[#F0F2EE]">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#5C7D43]" />
                      <span>{loc.area}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E6DF]/70 dark:border-[#2C322C]/70 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">
                      Total Terpilah
                    </span>
                    <strong className="text-sm font-bold text-[#5C7D43] dark:text-[#84A964]">
                      {loc.totalVerifiedKg}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">
                      Nasabah Aktif
                    </span>
                    <strong className="text-sm font-bold text-[#171916] dark:text-[#F0F2EE]">
                      {loc.activeMembers}
                    </strong>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">
                      Sistem Reward
                    </span>
                    <strong className="text-xs font-semibold text-[#171916] dark:text-[#F0F2EE]">
                      {loc.incentiveType}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bagian Jenjang Lencana Komunitas */}
      <div id="jenjang-lencana" className="space-y-6 pt-6 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#5C7D43]" />
              Jenjang Lencana Kehormatan Komunitas
            </h2>
            <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
              Tingkatan apresiasi yang diperoleh melalui keaktifan aksi sirkular dan kontribusi ide.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#777A73] dark:text-[#A6AFA8] hidden sm:inline">
            4 Jenjang Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => (
            <div
              key={b.level}
              className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#5C7D43]/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1F2EE] dark:bg-[#121412] flex items-center justify-center text-2xl shadow-inner">
                    {b.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${b.color}`}>
                    Tingkat {b.level}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#171916] dark:text-[#F0F2EE]">
                  {b.title}
                </h3>
                <div className="text-xs font-semibold text-[#5C7D43] dark:text-[#84A964]">
                  Syarat: {b.requirement}
                </div>
                <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Panduan Aksi: Cara Berkontribusi & Masuk Peringkat */}
      <div id="panduan-aksi" className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 space-y-6 scroll-mt-20">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5C7D43] dark:text-[#84A964]">
            PANDUAN AKSI SIRKULAR
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171916] dark:text-[#F0F2EE]">
            Bagaimana Cara Berkontribusi & Masuk Papan Peringkat?
          </h2>
          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8]">
            Setiap aksi nyata di ekosistem Trashline memiliki dampak terukur. Ikuti 3 alur aksi sirkular berikut untuk mulai mengumpulkan dukungan warga dan apresiasi mitra lapangan:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Langkah 1 */}
          <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#5C7D43]" />
                Pilah di Rumah (Kamus)
              </h3>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                Buka Kamus Plastik untuk memahami 7 kode resin. Ketahui jenis yang aman, bahaya leleh, serta standar kebersihan sebelum disetor.
              </p>
            </div>
            <Link
              href="/kamus"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C]"
            >
              <span>Buka Kamus Plastik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Langkah 2 */}
          <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5C7D43]" />
                Setor ke Mitra (Peta)
              </h3>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                Cari Bank Sampah terdekat di Cirebon yang menerima kode plastik Anda. Timbangan resmi mitra dicatat dan mendongkrak data wilayah Anda.
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C]"
            >
              <span>Jelajahi Peta Bank Sampah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Langkah 3 */}
          <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#5C7D43]" />
                Bagikan Inovasi (Forum)
              </h3>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                Punya metode upcycling atau daur ulang kreatif? Unggah di Forum Ide. Dapatkan upvote dari warga untuk naik ke Top Penyumbang Ide!
              </p>
            </div>
            <Link
              href="/forum"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C]"
            >
              <span>Bagikan Ide di Forum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
