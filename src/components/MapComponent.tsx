'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WasteBank } from '../types';
import { MOCK_WASTE_BANKS } from '../data/mockWasteBanks';
import { PLASTIC_DATA } from '../data/plastics';
import { supabase } from '../lib/supabase';
import {
  MapPin,
  Search,
  Filter,
  Clock,
  Phone,
  Coins,
  Compass,
  Navigation,
  CheckCircle2,
  ExternalLink,
  X,
  RotateCcw
} from 'lucide-react';

export default function MapComponent() {
  const searchParams = useSearchParams();
  const plasticParam = searchParams.get('plastic');

  const [banks, setBanks] = useState<WasteBank[]>(MOCK_WASTE_BANKS);
  const [selectedCity, setSelectedCity] = useState<string>('Semua');
  const [selectedPlasticFilter, setSelectedPlasticFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBank, setActiveBank] = useState<WasteBank>(MOCK_WASTE_BANKS[0]);

  // Fetch live waste banks from Supabase
  useEffect(() => {
    async function loadBanks() {
      try {
        const { data, error } = await supabase.from('waste_banks').select('*');
        if (!error && data && data.length > 0) {
          const liveBanks: WasteBank[] = data.map((item: any, idx: number) => ({
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
            notes: item.notes || 'Menerima sampah plastik terpilah dalam kondisi bersih & kering.',
            rewardType: item.reward_type || 'Tunai / Poin'
          }));
          setBanks(liveBanks);
          setActiveBank(liveBanks[0]);
        }
      } catch (err) {
        console.warn('Menggunakan data percontohan lokal:', err);
      }
    }
    loadBanks();
  }, []);

  // Handle URL query parameter ?plastic=1 auto-filter
  useEffect(() => {
    if (plasticParam) {
      const pid = parseInt(plasticParam, 10);
      if (!isNaN(pid) && pid >= 1 && pid <= 7) {
        setSelectedPlasticFilter(pid);
        // Otomatis pilih bank sampah pertama yang menerima jenis plastik ini jika ada
        const firstMatching = banks.find(b => b.acceptedPlastics.includes(pid));
        if (firstMatching) {
          setActiveBank(firstMatching);
        }
      }
    }
  }, [plasticParam, banks]);

  // Extract unique cities
  const cities = ['Semua', ...Array.from(new Set(banks.map((b) => b.city)))];

  // Filtered list
  const filteredBanks = banks.filter((bank) => {
    const matchCity = selectedCity === 'Semua' || bank.city === selectedCity;
    const matchPlastic = selectedPlasticFilter === null || bank.acceptedPlastics.includes(selectedPlasticFilter);
    const matchSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchPlastic && matchSearch;
  });

  const hasActiveFilters = selectedCity !== 'Semua' || selectedPlasticFilter !== null || searchQuery.trim() !== '';

  const resetAllFilters = () => {
    setSelectedCity('Semua');
    setSelectedPlasticFilter(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar - Unified Responsive Container */}
      <div className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-4 sm:p-5 shadow-xs space-y-4">

        {/* Top Row: Search Input + City Filter Tabs */}
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
          {/* Search Input with Clear Button */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777A73] dark:text-[#A6AFA8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama bank sampah, jalan, atau kelurahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-full text-xs sm:text-sm bg-[#F1F2EE] dark:bg-[#121412] border border-transparent focus:border-[#5C7D43] focus:bg-white dark:focus:bg-[#1E221E] focus:ring-2 focus:ring-[#5C7D43]/20 transition-all text-[#171916] dark:text-[#F0F2EE] placeholder-[#777A73]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center text-[#171916] dark:text-[#F0F2EE] transition-colors"
                title="Hapus pencarian"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#777A73] dark:text-[#A6AFA8] shrink-0 mr-1 hidden sm:inline">
              Wilayah:
            </span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold shrink-0 transition-all active:scale-95 ${
                  selectedCity === city
                    ? 'bg-[#5C7D43] text-white shadow-xs'
                    : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE] hover:bg-[#E5E6DF] dark:hover:bg-[#252A25]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Plastic Type Filter Pills & Reset Button */}
        <div className="pt-3 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-xs font-bold text-[#777A73] dark:text-[#A6AFA8] shrink-0 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#5C7D43]" />
              Terima Plastik:
            </span>
            <button
              onClick={() => setSelectedPlasticFilter(null)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-all ${
                selectedPlasticFilter === null
                  ? 'bg-[#171916] text-white dark:bg-[#F0F2EE] dark:text-[#171916]'
                  : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] hover:bg-[#E5E6DF]'
              }`}
            >
              Semua Jenis
            </button>
            {PLASTIC_DATA.map((p) => {
              const isSelected = selectedPlasticFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlasticFilter(isSelected ? null : p.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'text-white shadow-xs scale-105 ring-2 ring-black/15 dark:ring-white/20'
                      : 'bg-[#F1F2EE] dark:bg-[#121412] text-[#777A73] dark:text-[#A6AFA8] hover:opacity-85'
                  }`}
                  style={{ backgroundColor: isSelected ? p.color : undefined }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isSelected ? '#ffffff' : p.color }}
                  />
                  <span>♳{p.id} {p.code}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Filters CTA if active */}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs font-semibold text-[#5C7D43] dark:text-[#84A964] hover:underline flex items-center gap-1 shrink-0 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Grid: Map Visual & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Col: Interactive List */}
        <div className="lg:col-span-1 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#777A73] dark:text-[#A6AFA8] mb-1">
            <span>Ditemukan {filteredBanks.length} Lokasi Terverifikasi</span>
            {hasActiveFilters && (
              <span className="text-[10px] text-[#5C7D43] dark:text-[#84A964] font-bold">
                (Filter Aktif)
              </span>
            )}
          </div>

          {filteredBanks.map((bank) => {
            const isSelected = activeBank.id === bank.id;
            return (
              <div
                key={bank.id}
                onClick={() => setActiveBank(bank)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5C7D43]/10 dark:bg-[#5C7D43]/20 border-[#5C7D43] shadow-xs'
                    : 'bg-white dark:bg-[#1E221E] border-[#E5E6DF] dark:border-[#2C322C] hover:border-[#5C7D43]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm text-[#171916] dark:text-[#F0F2EE] leading-snug tracking-tight">
                    {bank.name}
                  </h4>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#84A964] shrink-0">
                    {bank.rewardType}
                  </span>
                </div>

                <p className="text-xs text-[#777A73] dark:text-[#A6AFA8] line-clamp-2 mb-3 leading-relaxed">
                  {bank.address}
                </p>

                {/* Accepted types tags */}
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] font-medium mr-1">Terima:</span>
                  {bank.acceptedPlastics.map((pid) => (
                    <span
                      key={pid}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F2EE] dark:bg-[#121412] font-medium text-[#171916] dark:text-[#F0F2EE]"
                    >
                      ♳{pid}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredBanks.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-[#1E221E] rounded-2xl border border-dashed border-[#E5E6DF] dark:border-[#2C322C] p-6">
              <Compass className="w-8 h-8 text-[#777A73] mx-auto mb-2 animate-bounce" />
              <p className="text-xs text-[#777A73] dark:text-[#A6AFA8]">Tidak ada Bank Sampah yang cocok dengan filter yang dipilih.</p>
            </div>
          )}
        </div>

        {/* Right Col: Active Bank Detail Card & GPS Navigation Map Screen */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Real Interactive Map Display with Coordinates & Trashline Frame */}
          <div className="relative w-full h-96 rounded-3xl overflow-hidden border border-[#E5E6DF] dark:border-[#2C322C] bg-[#E8EAE6] dark:bg-[#161916] shadow-inner">

            {/* Interactive OpenStreetMap Embed */}
            <iframe
              title={`Peta Lokasi ${activeBank.name}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeBank.longitude - 0.015}%2C${activeBank.latitude - 0.01}%2C${activeBank.longitude + 0.015}%2C${activeBank.latitude + 0.01}&layer=mapnik&marker=${activeBank.latitude}%2C${activeBank.longitude}`}
              className="w-full h-full border-0 filter contrast-[1.03] opacity-90 dark:opacity-80 dark:invert dark:hue-rotate-180"
              loading="lazy"
            />

            {/* Floating Top Banner: Active Bank Info Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#1E221E]/90 backdrop-blur-md shadow-md border border-black/[0.06] dark:border-white/[0.1]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5C7D43] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-semibold text-[#777A73] dark:text-[#A6AFA8] tracking-wider">
                  Pin Lokasi Terpilih
                </span>
                <span className="text-xs font-semibold text-[#171916] dark:text-[#F0F2EE] line-clamp-1 tracking-tight">
                  {activeBank.name}
                </span>
              </div>
            </div>

            {/* Floating Top-Right: Direct Route CTA */}
            <div className="absolute top-3 right-3 z-10">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeBank.latitude},${activeBank.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#5C7D43] text-white hover:bg-[#4E6B38] text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Buka Rute Navigasi</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            {/* Floating Bottom Chips: Coordinates & City */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-white/85 dark:bg-black/75 backdrop-blur-md text-[11px] text-[#171916] dark:text-[#F0F2EE] font-medium border border-black/[0.05] dark:border-white/[0.1] pointer-events-auto">
                📍 {activeBank.city} • <span className="font-mono text-[#777A73] dark:text-[#A6AFA8]">{activeBank.latitude.toFixed(4)}, {activeBank.longitude.toFixed(4)}</span>
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-white/85 dark:bg-black/75 backdrop-blur-md text-[10px] text-[#777A73] dark:text-[#A6AFA8] font-medium border border-black/[0.05] dark:border-white/[0.1]">
                © OpenStreetMap
              </div>
            </div>
          </div>

          {/* Active Detail Container */}
          <div className="bg-white dark:bg-[#1E221E] rounded-3xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
              <div>
                <span className="text-[10px] font-semibold text-[#5C7D43] dark:text-[#84A964] uppercase tracking-wider block mb-1">
                  Detail Lokasi Terpilih
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE]">
                  {activeBank.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {activeBank.whatsapp && (
                  <a
                    href={`https://wa.me/${activeBank.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${activeBank.name}, saya ingin bertanya mengenai penyetoran sampah plastik...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full text-xs font-semibold bg-[#5C7D43] text-white hover:bg-[#4E6B38] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Hubungi WhatsApp</span>
                  </a>
                )}
                {activeBank.phone && (
                  <a
                    href={`tel:${activeBank.phone}`}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-[#F1F2EE] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] hover:bg-[#E5E6DF] transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 text-xs">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-[#777A73] dark:text-[#A6AFA8]">
                  <MapPin className="w-4 h-4 text-[#5C7D43] shrink-0 mt-0.5" />
                  <span className="text-[#171916] dark:text-[#F0F2EE] font-medium leading-relaxed">{activeBank.address}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#777A73] dark:text-[#A6AFA8]">
                  <Clock className="w-4 h-4 text-[#5C7D43] shrink-0" />
                  <span className="text-[#171916] dark:text-[#F0F2EE] font-medium">{activeBank.operatingHours}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#777A73] dark:text-[#A6AFA8]">
                  <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[#171916] dark:text-[#F0F2EE]">Sistem Insentif: <strong className="text-[#171916] dark:text-[#F0F2EE]">{activeBank.rewardType}</strong></span>
                </div>
                {activeBank.notes && (
                  <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8] italic bg-[#F1F2EE]/60 dark:bg-[#121412]/50 p-3 rounded-2xl border border-[#E5E6DF]/50 dark:border-[#2C322C]/50">
                    "{activeBank.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Accepted Types Matrix */}
            <div className="pt-4 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
              <span className="text-xs font-bold text-[#171916] dark:text-[#F0F2EE] block mb-3">
                Daftar Jenis Plastik yang Diterima di Lokasi Ini:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeBank.acceptedPlastics.map((pid) => {
                  const pData = PLASTIC_DATA.find((p) => p.id === pid);
                  return (
                    <div
                      key={pid}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#F1F2EE]/80 dark:bg-[#121412]/70 border border-[#E5E6DF]/70 dark:border-[#2C322C]/70"
                    >
                      <div
                        className="w-7 h-7 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: pData?.color || '#5C7D43' }}
                      >
                        ♳{pid}
                      </div>
                      <span className="text-[11px] font-semibold text-[#171916] dark:text-[#F0F2EE] truncate">
                        {pData?.code || `Plastik #${pid}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
