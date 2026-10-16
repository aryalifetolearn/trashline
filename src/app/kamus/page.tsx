'use client';

import React, { useState } from 'react';
import { PLASTIC_DATA } from '../../data/plastics';
import { PlasticType } from '../../types';
import PlasticCard from '../../components/PlasticCard';
import PlasticModal from '../../components/PlasticModal';
import Breadcrumb from '../../components/Breadcrumb';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Sparkles, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function KamusPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecyclability, setFilterRecyclability] = useState<string>('Semua');
  const [selectedPlastic, setSelectedPlastic] = useState<PlasticType | null>(null);

  const filteredPlastics = PLASTIC_DATA.filter((p) => {
    const matchSearch = 
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chemicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.commonProducts.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchRecyclability = 
      filterRecyclability === 'Semua' || 
      p.recyclability === filterRecyclability;

    return matchSearch && matchRecyclability;
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-8 text-[#171916] dark:text-[#F0F2EE]">
      <Breadcrumb items={[{ label: 'Kamus Plastik' }]} />

      {/* Header Banner - Gaya Trashline Editorial */}
      <section className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5 text-[#5C7D43]" />
            <span>ENSIKLOPEDIA RESMI DAUR ULANG</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.08]">
            Kamus <span className="text-[#5C7D43] dark:text-[#D8ED78]">7 Kode Plastik</span>,<br />
            Kenali Sebelum Membuang.
          </h1>

          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-2xl">
            Setiap simbol segitiga daur ulang menyimpan karakteristik kimia, tingkat bahaya bagi kesehatan, serta langkah pembersihan yang berbeda. Pelajari panduannya agar sampahmu siap disetor dan bernilai tinggi di Bank Sampah.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#777A73] dark:text-[#A6AFA8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5C7D43]" />
              Standar Kode Resin Internasional
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D8ED78]" />
              Panduan Pemilahan Rumahan
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="rounded-[20px] bg-white dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#777A73] dark:text-[#A6AFA8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari botol mineral, tutup galon, pipa PVC, kresek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] outline-none text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73] transition-colors"
          />
        </div>

        {/* Filter by Recyclability */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold text-[#777A73] dark:text-[#A6AFA8] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#5C7D43]" />
            Daur Ulang:
          </span>
          {['Semua', 'Tinggi', 'Sedang', 'Rendah / Khusus', 'Sangat Sulit'].map((val) => (
            <button
              key={val}
              onClick={() => setFilterRecyclability(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                filterRecyclability === val
                  ? 'bg-[#5C7D43] text-white shadow-xs'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE]'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

      </section>

      {/* Counter bar */}
      <div className="flex items-center justify-between text-xs text-[#777A73] dark:text-[#A6AFA8] px-1">
        <span>Menampilkan <strong className="text-[#171916] dark:text-[#F0F2EE]">{filteredPlastics.length}</strong> dari 7 jenis kode plastik</span>
        {(searchQuery || filterRecyclability !== 'Semua') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRecyclability('Semua');
            }}
            className="text-[#5C7D43] hover:underline font-semibold"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Grid of filtered cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredPlastics.map((plastic) => (
          <PlasticCard
            key={plastic.id}
            plastic={plastic}
            onSelect={(p) => setSelectedPlastic(p)}
          />
        ))}
      </div>

      {filteredPlastics.length === 0 && (
        <div className="text-center py-16 bg-[#F1F2EE] dark:bg-[#1A1D1A] rounded-[24px] border border-dashed border-[#E5E6DF] dark:border-[#2C322C] p-8 space-y-2">
          <Info className="w-10 h-10 text-[#777A73] mx-auto mb-2 opacity-60" />
          <h3 className="text-sm font-bold text-[#171916] dark:text-[#F0F2EE]">Tidak ada jenis plastik yang sesuai</h3>
          <p className="text-xs text-[#777A73] dark:text-[#A6AFA8]">
            Coba gunakan kata kunci lain seperti "botol", "kresek", "galon", atau klik tombol Reset Filter.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <PlasticModal
        plastic={selectedPlastic}
        onClose={() => setSelectedPlastic(null)}
      />

    </div>
  );
}
