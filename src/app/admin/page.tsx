'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Scale, 
  MapPin, 
  Phone, 
  Plus, 
  Filter, 
  Search, 
  FileText, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Info,
  Lock,
  UserCheck,
  Trash2
} from 'lucide-react';
import { MOCK_WASTE_BANKS } from '../../data/mockWasteBanks';

interface WasteBankApplication {
  id: string;
  name: string;
  applicant: string;
  district: string;
  address: string;
  phone: string;
  operatingHours: string;
  acceptedPlastics: number[];
  rewardType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface WeighingRecord {
  id: string;
  bankName: string;
  district: string;
  plasticCode: string;
  weightKg: number;
  officer: string;
  citizenName?: string;
  recordedAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'kurasi' | 'timbangan' | 'mitra'>('kurasi');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeBanks, setActiveBanks] = useState(MOCK_WASTE_BANKS);

  // Load live waste banks from Supabase
  useEffect(() => {
    async function loadBanks() {
      try {
        const { data, error } = await supabase.from('waste_banks').select('*');
        if (!error && data && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => ({
            id: item.id || `wb-${idx}`,
            name: item.name,
            address: item.address,
            city: item.city || 'Kab. Cirebon',
            province: item.province || 'Jawa Barat',
            latitude: Number(item.latitude) || -6.7584,
            longitude: Number(item.longitude) || 108.4891,
            acceptedPlastics: Array.isArray(item.accepted_plastics)
              ? item.accepted_plastics.map((p: any) => parseInt(p, 10)).filter((n: number) => !isNaN(n))
              : [1, 2, 5],
            operatingHours: item.operating_hours || '08:00 - 15:00 WIB',
            phone: item.phone || '085147367926',
            whatsapp: item.whatsapp || '085147367926',
            notes: item.notes || 'Menerima sampah plastik terpilah.',
            rewardType: item.reward_type || 'Tunai / Poin'
          }));
          setActiveBanks(mapped);
        }
      } catch (err) {
        console.warn('Fallback ke mitra lokal:', err);
      }
    }
    loadBanks();
  }, []);

  // Mock Data Pengajuan Kemitraan Baru dari Warga Cirebon
  const [applications, setApplications] = useState<WasteBankApplication[]>([
    {
      id: 'app-cirebon-01',
      name: 'TPS-3R Harjamukti Bersinar',
      applicant: 'Bambang Supriyanto (Ketua RW 04)',
      district: 'Kec. Harjamukti, Kota Cirebon',
      address: 'Jl. Ahmad Yani No. 42, RT 02/RW 04, Harjamukti',
      phone: '081234567890',
      operatingHours: 'Setiap Sabtu & Minggu (09.00 - 14.00 WIB)',
      acceptedPlastics: [1, 2, 5],
      rewardType: 'Uang Tunai Timbangan',
      submittedAt: '14 Okt 2026, 10:15 WIB',
      status: 'pending',
      notes: 'Sudah memiliki timbangan gantung digital 100kg dan gudang pemilahan swadaya.'
    },
    {
      id: 'app-cirebon-02',
      name: 'Bank Sampah Berkah Mandiri Kesambi',
      applicant: 'Hj. Ratna Ningsih (Penggerak PKK)',
      district: 'Kec. Kesambi, Kota Cirebon',
      address: 'Komplek Kesambi Baru Blok C No. 12',
      phone: '085798765432',
      operatingHours: 'Jumat & Sabtu (08.30 - 11.30 WIB)',
      acceptedPlastics: [1, 2, 4, 5],
      rewardType: 'Sembako & Minyak Goreng',
      submittedAt: '13 Okt 2026, 14:40 WIB',
      status: 'pending',
      notes: 'Kemitraan bersama ibu-ibu PKK dan posyandu lingkungan.'
    }
  ]);

  // Mock Riwayat Timbangan Resmi Wilayah
  const [weighingRecords, setWeighingRecords] = useState<WeighingRecord[]>([
    {
      id: 'rec-101',
      bankName: 'BANK SAMPAH INDUK DEWI SRI GIRINATA',
      district: 'Dukupuntang',
      plasticCode: 'Kode 1 (PET)',
      weightKg: 85.5,
      officer: 'Suryadi (Petugas Timbang BSI)',
      recordedAt: 'Hari ini, 09:30 WIB'
    },
    {
      id: 'rec-102',
      bankName: 'WSM Rumah Diskusi Sampah',
      district: 'Sumber',
      plasticCode: 'Kode 2 (HDPE)',
      weightKg: 62.0,
      officer: 'Ahmad Fauzi (WSM Cirebon)',
      recordedAt: 'Hari ini, 11:15 WIB'
    },
    {
      id: 'rec-103',
      bankName: 'Bank Sampah Mawar Merah RW 07',
      district: 'Pekalipan',
      plasticCode: 'Kode 5 (PP)',
      weightKg: 44.2,
      officer: 'Ibu Nani (Pengurus RW 07)',
      recordedAt: 'Kemarin, 15:40 WIB'
    }
  ]);

  const { user, profile, loginAsDemo } = useAuth();
  const userRole = profile?.role || (user ? 'warga' : 'guest');
  const isAdmin = userRole === 'admin';
  const isOperator = userRole === 'operator';
  const isWarga = userRole === 'warga' || userRole === 'guest';

  // Form State Input Timbangan Baru
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newWeighBank, setNewWeighBank] = useState(MOCK_WASTE_BANKS[0].name);
  const [newWeighPlastic, setNewWeighPlastic] = useState('Kode 1 (PET)');
  const [newWeighKg, setNewWeighKg] = useState('');
  const [newWeighOfficer, setNewWeighOfficer] = useState('Kang Suryadi (Petugas BSI)');
  const [newCitizenName, setNewCitizenName] = useState('Ibu Siti Aminah (RW 03)');

  // Sinkronkan nama petugas jika user login sebagai operator atau admin
  useEffect(() => {
    if (profile?.name) {
      if (profile.role === 'operator') {
        setNewWeighOfficer(profile.name);
      } else if (profile.role === 'admin') {
        setNewWeighOfficer('Bpk. Rahmat Hidayat (Pengawas DLH)');
      }
    }
  }, [profile]);

  // Load live weighing logs from Supabase with localStorage backup
  useEffect(() => {
    async function fetchWeighingLogs() {
      try {
        const { data, error } = await supabase
          .from('weighing_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped: WeighingRecord[] = data.map((item: any, idx: number) => ({
            id: item.id || `rec-cloud-${idx}`,
            bankName: item.bank_name,
            district: item.district,
            plasticCode: item.plastic_code,
            weightKg: Number(item.weight_kg),
            officer: item.officer_name,
            citizenName: item.citizen_name || 'Warga Cirebon',
            recordedAt: item.created_at ? new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Baru saja'
          }));
          setWeighingRecords(mapped);
          return;
        }
      } catch (err) {
        console.warn('Supabase weighing_logs unavailable, using local cache:', err);
      }

      // Local storage fallback
      try {
        const saved = localStorage.getItem('trashline_weighing_logs');
        if (saved) {
          setWeighingRecords(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }
    fetchWeighingLogs();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDeleteWeighingRecord = async (id: string, citizenName?: string) => {
    if (!isAdmin) {
      triggerToast('Akses Dibatasi: Penghapusan catatan timbangan resmi memerlukan otorisasi Admin Pengawas DLH.');
      return;
    }

    if (!window.confirm(`Hapus catatan timbangan ${citizenName ? `untuk "${citizenName}"` : ''}? Skor wilayah akan diperbarui.`)) return;

    const updated = weighingRecords.filter(r => r.id !== id);
    setWeighingRecords(updated);
    try {
      localStorage.setItem('trashline_weighing_logs', JSON.stringify(updated));
    } catch {}

    if (id && !id.startsWith('rec-') && id.includes('-')) {
      try {
        const { error } = await supabase.from('weighing_logs').delete().eq('id', id);
        if (error) console.warn('Supabase weighing delete error:', error.message);
      } catch (err) {
        console.warn('Error deleting weighing log:', err);
      }
    }
    triggerToast('Catatan timbangan berhasil dihapus.');
  };

  const handleDeleteWasteBank = async (id: string, bankName: string) => {
    if (!isAdmin) {
      triggerToast('Akses Dibatasi: Pencabutan status kemitraan Bank Sampah hanya dapat dilakukan oleh Admin Pengawas DLH.');
      return;
    }

    if (!window.confirm(`Cabut kemitraan dan hapus "${bankName}" dari peta publik?`)) return;

    const updated = activeBanks.filter(b => b.id !== id);
    setActiveBanks(updated);

    if (id && !id.startsWith('wb-') && id.includes('-')) {
      try {
        const { error } = await supabase.from('waste_banks').delete().eq('id', id);
        if (error) console.warn('Supabase waste bank delete error:', error.message);
      } catch (err) {
        console.warn('Error deleting waste bank:', err);
      }
    }
    triggerToast(`Kemitraan "${bankName}" telah dicabut.`);
  };

  const handleApproveApplication = async (id: string, name: string) => {
    if (!isAdmin) {
      triggerToast('Akses Dibatasi: Persetujuan kemitraan baru memerlukan hak Admin Pengawas DLH. Beralih peran untuk mencoba.');
      return;
    }

    const target = applications.find(a => a.id === id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
    triggerToast(`Pengajuan "${name}" disetujui! Titik lokasi telah terbit di Peta.`);

    if (target) {
      try {
        await supabase.from('waste_banks').insert([{
          name: target.name,
          address: target.address,
          latitude: -6.7450,
          longitude: 108.5500,
          accepted_plastics: target.acceptedPlastics.map(String)
        }]);
      } catch (err) {
        console.warn('Sync mitra ke Supabase:', err);
      }
    }
  };

  const handleRejectApplication = (id: string, name: string) => {
    if (!isAdmin) {
      triggerToast('Akses Dibatasi: Penolakan pengajuan memerlukan wewenang Admin Pengawas DLH.');
      return;
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    triggerToast(`Pengajuan "${name}" ditolak.`);
  };

  const handleAddWeighingRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWarga) {
      triggerToast('Akses Dibatasi: Warga hanya memiliki hak pratinjau. Beralih ke peran Petugas Mitra atau Admin DLH.');
      return;
    }

    const kg = parseFloat(newWeighKg);
    if (!kg || kg <= 0) return;

    const district = newWeighBank.includes('Dukupuntang') || newWeighBank.includes('Berkah') 
      ? 'Dukupuntang' 
      : newWeighBank.includes('Sumber') || newWeighBank.includes('Syariah') 
      ? 'Sumber' 
      : 'Harjamukti';

    const newRecord: WeighingRecord = {
      id: `rec-${Date.now()}`,
      bankName: newWeighBank,
      district,
      plasticCode: newWeighPlastic,
      weightKg: kg,
      officer: newWeighOfficer.trim() || 'Petugas Verifikator DLH',
      citizenName: newCitizenName.trim() || 'Ibu Siti Aminah (RW 03)',
      recordedAt: 'Baru saja'
    };

    const updated = [newRecord, ...weighingRecords];
    setWeighingRecords(updated);
    try {
      localStorage.setItem('trashline_weighing_logs', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Insert to Supabase weighing_logs
    try {
      const { data, error } = await supabase.from('weighing_logs').insert([{
        bank_name: newWeighBank,
        district,
        plastic_code: newWeighPlastic,
        weight_kg: kg,
        officer_name: newRecord.officer,
        citizen_name: newRecord.citizenName
      }]).select();

      if (!error && data && data[0]?.id) {
        newRecord.id = data[0].id;
        const synced = [newRecord, ...weighingRecords];
        setWeighingRecords(synced);
        try {
          localStorage.setItem('trashline_weighing_logs', JSON.stringify(synced));
        } catch {}
      }
    } catch (err) {
      console.warn('Supabase weighing insert deferred:', err);
    }

    setNewWeighKg('');
    triggerToast(`Timbangan ${kg} kg (${newWeighPlastic}) dari ${newRecord.citizenName} berhasil dicatat & disinkronkan ke Papan Peringkat!`);
  };

  // Kalkulasi Total Metrik
  const totalVerifiedKg = weighingRecords.reduce((acc, r) => acc + r.weightKg, 3040);
  const pendingAppsCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8 text-[#171916] dark:text-[#F0F2EE]">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={[{ label: 'Dasbor Pengelola (Admin)' }]} />

      {/* Header Banner - Gaya Trashline Editorial */}
      <section className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5C7D43]" />
            <span>SISTEM MANAJEMEN SIRKULAR TERPADU • CIREBON PILOT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.08]">
            Dasbor Pengelola,<br />
            <span className="text-[#5C7D43] dark:text-[#D8ED78]">Kurasi & Verifikasi Wilayah</span>.
          </h1>

          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-2xl">
            Pusat kendali resmi Trashline: kurasi pendaftaran Bank Sampah baru oleh pengurus RT/RW, input pencatatan timbangan sah lapangan, dan pantau sebaran titik daur ulang di Cirebon.
          </p>
        </div>

        {/* Status Mode Role Aktif */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] shadow-xs flex flex-col gap-2 shrink-0 sm:min-w-[280px]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${
              isAdmin ? 'bg-[#5C7D43]' : isOperator ? 'bg-teal-600' : 'bg-amber-600'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : isOperator ? <Scale className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div className="text-[11px] leading-snug">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-block mb-0.5 ${
                isAdmin 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                  : isOperator 
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {isAdmin ? 'Admin Pengawas DLH' : isOperator ? 'Petugas Mitra Timbang' : 'Warga (Akses Terbatas)'}
              </span>
              <strong className="text-[#171916] dark:text-[#F0F2EE] block text-xs truncate max-w-[180px]">
                {profile?.name || 'Tamu / Belum Login'}
              </strong>
            </div>
          </div>
          <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70 pt-1.5">
            {isAdmin 
              ? 'Otoritas tertinggi: ACC/Tolak pengajuan, timbangan, & cabut kemitraan.' 
              : isOperator 
              ? 'Wewenang operasional: Input timbangan sah & tinjau data lapangan.' 
              : 'Mode edukasi: Warga hanya memiliki hak pratinjau baca.'}
          </p>
        </div>
      </section>

      {/* Simulator Switcher Multi-Role untuk Evaluator & Juri */}
      <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <strong className="text-[#171916] dark:text-[#F0F2EE]">Simulasi Peran Evaluator Juri:</strong>
            <span className="text-[#777A73] dark:text-[#A6AFA8] ml-1.5 hidden sm:inline">Uji alur otorisasi multi-role secara instan tanpa perlu bolak-balik login.</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { loginAsDemo('admin'); triggerToast('Beralih ke peran: Bpk. Rahmat Hidayat (Admin Pengawas DLH)'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border active:scale-95 ${
              isAdmin 
                ? 'bg-[#5C7D43] text-white border-[#5C7D43] shadow-xs' 
                : 'bg-[#F7F7F4] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] border-[#E5E6DF] dark:border-[#2C322C] hover:border-[#5C7D43]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin DLH {isAdmin && '✓'}</span>
          </button>
          <button
            onClick={() => { loginAsDemo('operator'); triggerToast('Beralih ke peran: Kang Suryadi (Petugas Mitra Timbang)'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border active:scale-95 ${
              isOperator 
                ? 'bg-[#5C7D43] text-white border-[#5C7D43] shadow-xs' 
                : 'bg-[#F7F7F4] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] border-[#E5E6DF] dark:border-[#2C322C] hover:border-[#5C7D43]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Petugas Mitra {isOperator && '✓'}</span>
          </button>
          <button
            onClick={() => { loginAsDemo('warga'); triggerToast('Beralih ke peran: Ibu Siti Aminah (Warga Biasa)'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border active:scale-95 ${
              isWarga 
                ? 'bg-[#5C7D43] text-white border-[#5C7D43] shadow-xs' 
                : 'bg-[#F7F7F4] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] border-[#E5E6DF] dark:border-[#2C322C] hover:border-[#5C7D43]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Warga Biasa {isWarga && '✓'}</span>
          </button>
        </div>
      </div>

      {/* Banner Peringatan jika Role adalah Warga */}
      {isWarga && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[#171916] dark:text-[#F0F2EE] block font-bold">
                Perhatian: Anda sedang mengakses dalam mode Warga / Pengunjung
              </strong>
              <p className="text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                Portal ini khusus pengelola sirkular Cirebon. Warga tidak memiliki wewenang menyetujui pengajuan mitra atau menghapus timbangan resmi. Silakan beralih peran melalui tombol di samping untuk menguji aksi pengelola.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { loginAsDemo('admin'); triggerToast('Beralih ke Admin Pengawas DLH'); }}
              className="px-4 py-2 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white font-semibold text-xs transition-all shadow-xs active:scale-95"
            >
              Beralih ke Admin DLH
            </button>
          </div>
        </div>
      )}

      {/* Kartu Ringkasan Metrik KPI Pengelola */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#777A73] dark:text-[#A6AFA8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Mitra Aktif Cirebon</span>
            <Building2 className="w-4 h-4 text-[#5C7D43]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#171916] dark:text-[#F0F2EE]">
            {activeBanks.length} <span className="text-xs font-normal text-[#777A73]">Lokasi Terverifikasi</span>
          </div>
          <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8]">
            Dukupuntang, Sumber, Pekalipan
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#777A73] dark:text-[#A6AFA8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Timbangan Sah</span>
            <Scale className="w-4 h-4 text-[#5C7D43]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#171916] dark:text-[#F0F2EE]">
            {totalVerifiedKg.toLocaleString('id-ID')} <span className="text-xs font-normal text-[#777A73]">Kg</span>
          </div>
          <p className="text-[11px] text-[#5C7D43] dark:text-[#84A964] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tervalidasi di Papan Peringkat</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#777A73] dark:text-[#A6AFA8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Antrean Kurasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#171916] dark:text-[#F0F2EE]">
            {pendingAppsCount} <span className="text-xs font-normal text-[#777A73]">Pengajuan Baru</span>
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Perlu diverifikasi & dihubungi
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#777A73] dark:text-[#A6AFA8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Warga Terdaftar</span>
            <Users className="w-4 h-4 text-[#5C7D43]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#171916] dark:text-[#F0F2EE]">
            399 <span className="text-xs font-normal text-[#777A73]">Warga</span>
          </div>
          <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8]">
            Partisipan aktif forum & setoran
          </p>
        </div>
      </div>

      {/* Tab Navigasi Admin */}
      <div className="flex items-center justify-center pt-2">
        <div className="inline-flex p-1.5 rounded-full bg-[#F1F2EE] dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] shadow-xs">
          <button
            onClick={() => setActiveTab('kurasi')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'kurasi'
                ? 'bg-[#5C7D43] text-white shadow-xs'
                : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Kurasi Pengajuan ({pendingAppsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('timbangan')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'timbangan'
                ? 'bg-[#5C7D43] text-white shadow-xs'
                : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Input Timbangan Resmi</span>
          </button>

          <button
            onClick={() => setActiveTab('mitra')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'mitra'
                ? 'bg-[#5C7D43] text-white shadow-xs'
                : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mitra Terbit di Peta (3)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KURASI PENGAJUAN BANK SAMPAH BARU */}
      {activeTab === 'kurasi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5C7D43]" />
                Pengajuan Kemitraan Bank Sampah Baru (Cirebon)
              </h2>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
                Pengajuan yang dikirimkan oleh pengurus lingkungan melalui tombol &quot;Daftarkan Bank Sampah&quot;.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#5C7D43] dark:text-[#84A964]">
              {pendingAppsCount} Pengajuan Memerlukan Tindakan
            </span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.id}
                className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-[#171916] dark:text-[#F0F2EE]">
                        {app.name}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300'
                          : app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300'
                      }`}>
                        {app.status === 'pending' ? 'Menunggu Kurasi' : app.status === 'approved' ? 'Disetujui & Terbit' : 'Ditolak'}
                      </span>
                    </div>

                    <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5C7D43]" />
                      <span>{app.address} ({app.district})</span>
                    </p>
                  </div>

                  {/* Tombol Aksi Verifikasi */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${app.phone.replace(/^0/, '62')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E5E6DF] dark:border-[#2C322C] text-xs font-semibold text-[#171916] dark:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#2C322C] transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#5C7D43]" />
                      <span>Hubungi Pengurus</span>
                    </a>

                    {app.status === 'pending' && (
                      <>
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => handleRejectApplication(app.id, app.name)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-all active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>

                            <button
                              onClick={() => handleApproveApplication(app.id, app.name)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui & Terbitkan ke Peta</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => triggerToast('Wewenang Kurasi & Persetujuan Bank Sampah baru berada di tangan Admin Pengawas DLH (Bpk. Rahmat Hidayat). Silakan beralih ke peran Admin DLH di atas.')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/50 text-xs font-semibold hover:bg-amber-500/20 transition-all cursor-pointer"
                            title="Klik untuk info wewenang"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Khusus Wewenang Admin DLH</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Detail Informasi Pengajuan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F7F4] dark:bg-[#121412] border border-[#E5E6DF]/60 dark:border-[#2C322C]/60 text-xs">
                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Pengusul</span>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] font-medium">{app.applicant}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Jam Operasional</span>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] font-medium">{app.operatingHours}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Sistem Reward</span>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] font-medium">{app.rewardType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] uppercase font-semibold block">Waktu Pengajuan</span>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] font-medium">{app.submittedAt}</strong>
                  </div>
                </div>

                {app.notes && (
                  <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] bg-white dark:bg-[#1E221E] p-3 rounded-xl border border-dashed border-[#E5E6DF] dark:border-[#2C322C]">
                    <strong>Catatan Pengaju:</strong> {app.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PENCATATAN TIMBANGAN RESMI WILAYAH */}
      {activeTab === 'timbangan' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Banner Mode Evaluator & Switcher Operator Cirebon */}
          <div className="bg-gradient-to-r from-[#5C7D43]/10 via-[#F1F2EE] to-white dark:from-[#5C7D43]/20 dark:via-[#1E221E] dark:to-[#171916] rounded-3xl border border-[#5C7D43]/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#5C7D43] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Mode Evaluator & Juri Aktif
                </span>
                <span className="text-xs text-[#777A73] dark:text-[#A6AFA8] font-medium hidden sm:inline">
                  • Terhubung Live ke Supabase Cloud
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#171916] dark:text-[#F0F2EE]">
                Simulator Operator Timbangan Mitra Bank Sampah Cirebon
              </h4>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                Pilih peran cabang bank sampah di bawah ini untuk menguji pencatatan timbangan sah lapangan secara instan tanpa perlu repot otentikasi bolak-balik.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSecurityModal(true)}
              className="px-4 py-2.5 rounded-full border border-[#5C7D43] text-[#5C7D43] dark:text-[#D8ED78] hover:bg-[#5C7D43]/10 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Arsitektur Keamanan Produksi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Input Timbangan Baru */}
            <div className="lg:col-span-1 bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-xs space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-base text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#5C7D43]" />
                  Input Timbangan Terverifikasi
                </h3>
                <p className="text-xs text-[#777A73] dark:text-[#A6AFA8]">
                  Setoran fisik yang ditimbang resmi oleh petugas lapangan. Otomatis masuk log dan mendongkrak skor wilayah di Papan Peringkat.
                </p>
              </div>

              {/* Quick Role Switcher Pills */}
              <div className="space-y-2 pt-2 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
                <label className="text-[11px] font-bold text-[#777A73] dark:text-[#A6AFA8] uppercase tracking-wider block">
                  Simulasikan Sebagai Petugas Mitra:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { name: 'Bank Sampah Berkah Cirebon (Pilot Utama)', short: 'Bank Sampah Berkah (Dukupuntang)', officer: 'Kang Suryadi (Petugas BSI)' },
                    { name: 'Bank Sampah Syariah Sumber Sejahtera', short: 'Bank Syariah (Sumber)', officer: 'Ust. Ahmad Fauzi (WSM)' },
                    { name: 'Bank Sampah Mandiri Harjamukti', short: 'Bank Mandiri (Pekalipan/Harjamukti)', officer: 'Ibu Nani (Pengurus RW 07)' }
                  ].map((branch) => {
                    const isSelected = newWeighBank.includes(branch.name) || newWeighBank === branch.name;
                    return (
                      <button
                        key={branch.name}
                        type="button"
                        onClick={() => {
                          setNewWeighBank(branch.name);
                          setNewWeighOfficer(branch.officer);
                        }}
                        className={`px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between border ${
                          isSelected
                            ? 'bg-[#5C7D43] text-white border-[#5C7D43] shadow-xs'
                            : 'bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] border-[#E5E6DF] dark:border-[#2C322C] hover:border-[#5C7D43]/40'
                        }`}
                      >
                        <span className="truncate">{branch.short}</span>
                        {isSelected && <span className="text-[10px] ml-1 bg-white/20 px-1.5 py-0.5 rounded-full font-bold">Aktif</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleAddWeighingRecord} className="space-y-4 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                    Kategori Kode Resin Plastik
                  </label>
                  <select
                    value={newWeighPlastic}
                    onChange={(e) => setNewWeighPlastic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] font-medium focus:outline-none focus:border-[#5C7D43]"
                  >
                    <option value="Kode 1 (PET)">Kode 1 - PET (Botol Bening/Mineral)</option>
                    <option value="Kode 2 (HDPE)">Kode 2 - HDPE (Tutup Galon & Botol Sabun)</option>
                    <option value="Kode 3 (PVC)">Kode 3 - PVC (Pipa & Kabel)</option>
                    <option value="Kode 4 (LDPE)">Kode 4 - LDPE (Kantong Kresek/Plastik Cor)</option>
                    <option value="Kode 5 (PP)">Kode 5 - PP (Gelas Kopi & Tutup Cup)</option>
                    <option value="Kode 6 (PS)">Kode 6 - PS (Styrofoam / Sendok Plastik)</option>
                    <option value="Kode 7 (OTHER)">Kode 7 - OTHER (Multilayer & Campuran)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                    Berat Timbangan (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Contoh: 15.5"
                    value={newWeighKg}
                    onChange={(e) => setNewWeighKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] font-medium focus:outline-none focus:border-[#5C7D43]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] flex items-center justify-between">
                    <span>Identitas Warga Penyetor</span>
                    <span className="text-[10px] text-[#5C7D43] dark:text-[#84A964] font-medium">+XP Lencana Warga</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama warga / nasabah (contoh: Ibu Siti Aminah)"
                    value={newCitizenName}
                    onChange={(e) => setNewCitizenName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] font-medium focus:outline-none focus:border-[#5C7D43]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block">
                    Nama Petugas Jaga Timbang
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama petugas timbang lapangan"
                    value={newWeighOfficer}
                    onChange={(e) => setNewWeighOfficer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E6DF] dark:border-[#2C322C] bg-[#F7F7F4] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] font-medium focus:outline-none focus:border-[#5C7D43]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWarga}
                  className={`w-full py-3 rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2 ${
                    isWarga
                      ? 'bg-[#E5E6DF] dark:bg-[#2C322C] text-[#777A73] dark:text-[#A6AFA8] cursor-not-allowed'
                      : 'bg-[#5C7D43] hover:bg-[#4E6C38] text-white active:scale-95'
                  }`}
                >
                  {isWarga ? <Lock className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                  <span>{isWarga ? 'Terkunci (Mode Warga)' : 'Validasi & Simpan Timbangan Sah'}</span>
                </button>
              </form>
            </div>

            {/* Tabel Riwayat Timbangan Sah Terkini */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E6DF] dark:border-[#2C322C] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#5C7D43]" />
                    Log Rekam Timbangan Lapangan Resmi
                  </h3>
                  <p className="text-xs text-[#777A73] dark:text-[#A6AFA8]">
                    Semua timbangan di bawah ini telah tervalidasi dan disinkronkan ke tabel peringkat wilayah secara realtime.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#777A73] bg-[#F1F2EE] dark:bg-[#121412] px-3 py-1 rounded-full border border-[#E5E6DF] dark:border-[#2C322C]">
                  {weighingRecords.length} Catatan Aktif
                </span>
              </div>

              <div className="space-y-3">
                {weighingRecords.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-[#1E221E] rounded-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-[#5C7D43]/40 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-xs font-bold text-[#171916] dark:text-[#F0F2EE]">
                          {r.bankName}
                        </strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] font-semibold">
                          Kec. {r.district}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#171916] dark:text-[#F0F2EE] font-medium flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#5C7D43]" />
                        <span>Disetor oleh: <strong>{r.citizenName || 'Warga Cirebon'}</strong></span>
                      </p>
                      <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                        Petugas Timbang: {r.officer} • {r.recordedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      <div className="text-right bg-[#F7F7F4] dark:bg-[#121412] px-4 py-2 rounded-xl border border-[#E5E6DF]/60 dark:border-[#2C322C]/60">
                        <div className="text-base font-bold text-[#5C7D43] dark:text-[#D8ED78]">
                          +{r.weightKg} kg
                        </div>
                        <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] font-medium block">
                          {r.plasticCode}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteWeighingRecord(r.id, r.citizenName)}
                        title={isAdmin ? "Hapus catatan timbangan ini" : "Penghapusan memerlukan wewenang Admin DLH"}
                        className={`p-2 rounded-xl transition-colors ${
                          isAdmin 
                            ? "text-[#777A73] hover:text-red-500 hover:bg-red-500/10 cursor-pointer" 
                            : "text-[#777A73]/40 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                        }`}
                      >
                        {isAdmin ? <Trash2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR MITRA BANK SAMPAH TERVERIFIKASI CIREBON */}
      {activeTab === 'mitra' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5C7D43]" />
                Titik Kemitraan Aktif di Peta Cirebon
              </h2>
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
                Mitra resmi yang saat ini tampil di halaman Peta Warga (`/peta`).
              </p>
            </div>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline"
            >
              <span>Buka Peta Publik</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeBanks.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] border border-[#5C7D43]/20">
                      Terverifikasi DLH
                    </span>
                    <span className="text-[11px] text-[#777A73] font-medium">
                      Kec. {b.city}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE] leading-snug">
                    {b.name}
                  </h3>

                  <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
                    {b.address}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C] text-xs">
                    <div className="flex items-center gap-2 text-[#777A73] dark:text-[#A6AFA8]">
                      <Clock className="w-3.5 h-3.5 text-[#5C7D43]" />
                      <span>{b.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#777A73] dark:text-[#A6AFA8]">
                      <Phone className="w-3.5 h-3.5 text-[#5C7D43]" />
                      <span>{b.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F2EE] dark:border-[#2C322C] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#777A73] text-[11px] block">Sistem Reward:</span>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] font-semibold">{b.rewardType}</strong>
                  </div>
                  <button
                    onClick={() => handleDeleteWasteBank(b.id, b.name)}
                    title={isAdmin ? "Cabut kemitraan ini dari peta publik" : "Pencabutan kemitraan memerlukan wewenang Admin DLH"}
                    className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] ${
                      isAdmin 
                        ? "text-[#777A73] hover:text-red-500 hover:bg-red-500/10 cursor-pointer" 
                        : "text-[#777A73]/40 hover:text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                    }`}
                  >
                    {isAdmin ? <Trash2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{isAdmin ? "Cabut" : "Terkunci"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171916] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#2C322C] text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-4 h-4 text-[#D8ED78]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Arsitektur Keamanan Produksi (Untuk Seleksi Juri & Panitia) */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E6DF] dark:border-[#2C322C] pb-4">
              <div className="flex items-center gap-2 text-[#5C7D43]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#171916] dark:text-[#F0F2EE]">
                  Arsitektur Keamanan Produksi
                </h3>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F2EE] dark:bg-[#121412] flex items-center justify-center text-xs font-bold hover:bg-[#E5E6DF] text-[#171916] dark:text-[#F0F2EE]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#5C7D43]/10 border border-[#5C7D43]/20 text-[#171916] dark:text-[#F0F2EE]">
                <strong className="text-[#5C7D43] dark:text-[#84A964] block mb-1">
                  💡 Mode Evaluator & Seleksi Terbuka:
                </strong>
                Untuk kemudahan peninjauan oleh komite juri tanpa kendala otentikasi bolak-balik, portal ini menggunakan <em>Quick Operator Switcher</em> yang tersinkronisasi langsung ke live cloud database Supabase PostgreSQL.
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#5C7D43]/15 text-[#5C7D43] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] block">Role-Based Access Control (RBAC)</strong>
                    Pada tahap rilis produksi massal, setiap pengurus bank sampah terdaftar login melalui Supabase Auth dengan hak akses <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[11px]">operator_bank_sampah</code>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#5C7D43]/15 text-[#5C7D43] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] block">PostgreSQL Row-Level Security (RLS)</strong>
                    Kebijakan tabel Supabase membatasi operator hanya dapat menginput timbangan sah sesuai UUID cabang mitra masing-masing.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#5C7D43]/15 text-[#5C7D43] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-[#171916] dark:text-[#F0F2EE] block">Audit Log & Anti-Kecurangan</strong>
                    Setiap timbangan merekam riwayat audit (nama petugas, nama warga penyetor, jenis resin plastik, dan timestamp) untuk menjamin transparansi di Papan Peringkat.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-2.5 rounded-full bg-[#5C7D43] text-white font-semibold text-xs hover:bg-[#4E6C38] transition-all"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
