'use client';

import React, { useState } from 'react';
import MapComponent from '../../components/MapComponent';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  MapPin, 
  ShieldCheck, 
  PlusCircle, 
  MessageCircle, 
  CheckCircle2, 
  X, 
  ExternalLink,
  Building2,
  Clock,
  Phone,
  Coins
} from 'lucide-react';

export default function PetaPage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form State Pengajuan
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district: 'Pekalipan (Kota Cirebon)',
    phone: '',
    hours: '',
    rewardType: 'Uang Tunai Timbangan',
    notes: ''
  });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const adminWhatsApp = '6285147367926'; // Nomor Resmi Admin Trashline Cirebon

    const message = `Halo Tim Kurasi Trashline Cirebon, saya ingin mengajukan kemitraan pendaftaran Bank Sampah baru:

🏢 *Nama Bank Sampah / TPS-3R*: ${formData.name}
📍 *Wilayah / Kecamatan*: ${formData.district}
🏠 *Alamat Lengkap*: ${formData.address}
📞 *Kontak Pengurus*: ${formData.phone}
⏰ *Jam & Hari Operasional*: ${formData.hours || 'Setiap Sabtu & Minggu'}
💰 *Sistem Reward*: ${formData.rewardType}
📝 *Catatan Tambahan*: ${formData.notes || 'Siap melayani penimbangan sampah daur ulang warga.'}

Mohon bantu verifikasi dan publikasikan titik lokasi kami di Peta Trashline. Terima kasih!`;

    const encodedUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(encodedUrl, '_blank');
    setShowRegisterModal(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8">
      <Breadcrumb items={[{ label: 'Peta Bank Sampah Cirebon' }]} />
      
      {/* Header Banner - Gaya Trashline Editorial */}
      <section className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#5C7D43]" />
            <span>WILAYAH PERCONTOHAN: CIREBON & SEKITARNYA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.08]">
            Peta <span className="text-[#5C7D43] dark:text-[#D8ED78]">Bank Sampah</span> Cirebon,<br />
            Salurkan Tepat Sasaran.
          </h1>

          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-2xl">
            Temukan lokasi Bank Sampah dan titik pengumpulan terverifikasi di wilayah Cirebon yang menerima jenis plastik spesifikmu. Cek jam operasional, sistem reward tunai, dan rute navigasi langsung.
          </p>
        </div>

        <button 
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#5C7D43] hover:bg-[#4E6B38] text-white font-semibold text-xs shadow-sm transition-all shrink-0 self-start md:self-end active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Daftarkan Bank Sampah Baru</span>
        </button>
      </section>

      {/* Main Map & Filter Component (Wrapped in Suspense for useSearchParams) */}
      <React.Suspense fallback={
        <div className="w-full h-96 rounded-3xl bg-[#F1F2EE] dark:bg-[#1E221E] flex items-center justify-center text-xs text-[#777A73]">
          Memuat Peta & Titik Bank Sampah Cirebon...
        </div>
      }>
        <MapComponent />
      </React.Suspense>

      {/* Info Callout - Trashline Earth-tone Style */}
      <div className="p-6 rounded-3xl bg-[#F1F2EE] dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#5C7D43] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE]">
              Tips Menyetor Sampah ke Bank Sampah
            </h4>
            <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-0.5">
              Pastikan botol dan wadah plastik dalam kondisi bersih dan kering sebelum ditimbang untuk mendapatkan harga/poin maksimal.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Pendaftaran Kemitraan Bank Sampah via WhatsApp Admin */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1E221E] rounded-[28px] p-6 sm:p-8 max-w-lg w-full border border-[#E5E6DF] dark:border-[#2C322C] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#84A964] text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Building2 className="w-3 h-3" />
                  <span>Kemitraan Wilayah Cirebon</span>
                </div>
                <h3 className="font-bold text-lg text-[#171916] dark:text-[#F0F2EE]">
                  Daftarkan Bank Sampah / TPS-3R
                </h3>
                <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] mt-1">
                  Formulir pengajuan titik baru akan diteruskan langsung ke WhatsApp Tim Kurasi Admin Trashline untuk verifikasi lapangan.
                </p>
              </div>

              <button
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] hover:text-[#171916] dark:hover:text-[#F0F2EE] flex items-center justify-center text-sm font-bold transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Nama Bank Sampah / Unit Penimbangan:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Sampah Berkah RW 05"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                    Kecamatan / Wilayah:
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE]"
                  >
                    <option value="Pekalipan (Kota Cirebon)">Pekalipan (Kota Cirebon)</option>
                    <option value="Kejaksan (Kota Cirebon)">Kejaksan (Kota Cirebon)</option>
                    <option value="Kesambi (Kota Cirebon)">Kesambi (Kota Cirebon)</option>
                    <option value="Harjamukti (Kota Cirebon)">Harjamukti (Kota Cirebon)</option>
                    <option value="Lemahwungkuk (Kota Cirebon)">Lemahwungkuk (Kota Cirebon)</option>
                    <option value="Sumber (Kab. Cirebon)">Sumber (Kab. Cirebon)</option>
                    <option value="Dukupuntang (Kab. Cirebon)">Dukupuntang (Kab. Cirebon)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                    Nomor WhatsApp Pengurus:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 0812xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                  Alamat Lengkap / Patokan Lokasi:
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Nama Jalan No. XX, RT/RW, Kelurahan, dekat Masjid/Balai RW..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                    Jadwal / Jam Buka:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Setiap Sabtu, 08.00 - 14.00"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171916] dark:text-[#F0F2EE] block mb-1.5">
                    Sistem Reward Warga:
                  </label>
                  <select
                    value={formData.rewardType}
                    onChange={(e) => setFormData({ ...formData, rewardType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE]"
                  >
                    <option value="Uang Tunai Timbangan">Uang Tunai Timbangan</option>
                    <option value="SHU Koperasi / Simpanan">SHU Koperasi / Simpanan</option>
                    <option value="Tunai / Sedekah Kas RW">Tunai / Sedekah Kas RW</option>
                    <option value="Tukar Sembako">Tukar Sembako</option>
                    <option value="Tabungan Emas">Tabungan Emas</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#5C7D43]/10 border border-[#5C7D43]/20 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#5C7D43] shrink-0" />
                <span className="text-[11px] text-[#171916] dark:text-[#F0F2EE] leading-tight">
                  Data yang dikirim akan diverifikasi oleh Admin Trashline sebelum titik koordinat diterbitkan resmi ke peta.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2.5 rounded-full font-semibold text-[#777A73] hover:text-[#171916] dark:hover:text-[#F0F2EE] hover:bg-[#F1F2EE] dark:hover:bg-[#121412] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full font-semibold bg-[#5C7D43] hover:bg-[#4E6B38] text-white shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pengajuan via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
