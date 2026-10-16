'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Leaf, 
  Zap, 
  Award, 
  Trees, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function RecyclingCalculator() {
  const [bottleCount, setBottleCount] = useState<number>(25);

  // Approximate metrics: 1 PET bottle ~ 25g -> 40 bottles = 1 kg plastic
  // 1 kg PET recycled saves ~1.5 kg CO2, ~5.7 kWh energy
  const kgPlastic = (bottleCount * 0.025).toFixed(2);
  const co2Saved = (Number(kgPlastic) * 1.5).toFixed(2);
  const kwhSaved = (Number(kgPlastic) * 5.7).toFixed(1);
  const ecoPoints = bottleCount * 10;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-500/20 relative overflow-hidden">
      
      {/* Background glow circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulasi Dampak Nyata</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hitung Kontribusi Daur Ulang Anda
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-xl">
              Lihat seberapa besar kontribusi Anda terhadap kelestarian lingkungan hanya dengan memilah sampah plastik dari rumah.
            </p>
          </div>

          <Link
            href="/peringkat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <span>Klaim Lencana Anda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Slider Input */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex justify-between items-center mb-3">
            <label htmlFor="bottle-slider" className="text-sm font-semibold text-zinc-200">
              Jumlah Botol / Gelas Plastik yang Anda Pilah Minggu Ini:
            </label>
            <span className="text-2xl font-black text-emerald-400">
              {bottleCount} <span className="text-xs font-normal text-zinc-400">buah (~{kgPlastic} kg)</span>
            </span>
          </div>

          <input
            id="bottle-slider"
            type="range"
            min="1"
            max="200"
            value={bottleCount}
            onChange={(e) => setBottleCount(Number(e.target.value))}
            className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mt-2">
            <span>1 Botol</span>
            <span>50 Botol</span>
            <span>100 Botol</span>
            <span>200+ Botol (Pahlawan Lingkungan!)</span>
          </div>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{co2Saved} <span className="text-xs font-normal text-zinc-300">kg</span></div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Emisi CO₂ Dicegah</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{kwhSaved} <span className="text-xs font-normal text-zinc-300">kWh</span></div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Energi Listrik Dihemat</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-3">
              <Trees className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{kgPlastic} <span className="text-xs font-normal text-zinc-300">kg</span></div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Limbah Dicegah Masuk Laut</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-300 flex items-center justify-center mb-3">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">+{ecoPoints} <span className="text-xs font-normal text-zinc-300">XP</span></div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Poin Komunitas Didapat</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
