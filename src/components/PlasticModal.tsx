'use client';

import React from 'react';
import { PlasticType } from '../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Recycle, 
  Flame, 
  Sparkles,
  MapPin,
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface PlasticModalProps {
  plastic: PlasticType | null;
  onClose: () => void;
}

export default function PlasticModal({ plastic, onClose }: PlasticModalProps) {
  if (!plastic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1D1A] rounded-[24px] sm:rounded-[28px] shadow-2xl border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-8 text-[#171916] dark:text-[#F0F2EE]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#777A73] hover:text-[#171916] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0 font-mono"
            style={{ backgroundColor: plastic.color }}
          >
            ♳{plastic.id}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171916] dark:text-[#F0F2EE]">
                {plastic.code}
              </h2>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#D8ED78]">
                Kemudahan Daur Ulang: {plastic.recyclability}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#5C7D43] dark:text-[#D8ED78] mt-0.5">
              {plastic.name} ({plastic.chemicalName})
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-[16px] bg-[#F1F2EE] dark:bg-[#222622] border border-[#E5E6DF] dark:border-[#2C322C] mb-6">
          <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
            {plastic.description}
          </p>
        </div>

        {/* Common Products */}
        <div className="mb-6 space-y-2">
          <h3 className="text-xs font-bold text-[#171916] dark:text-[#F0F2EE] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5C7D43]" />
            Contoh Produk Sehari-hari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plastic.commonProducts.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F1F2EE]/70 dark:bg-[#222622]/70 text-xs text-[#171916] dark:text-[#F0F2EE] font-medium border border-[#E5E6DF]/50 dark:border-[#2C322C]/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#5C7D43] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-step Preparation Guide */}
        <div className="mb-6 space-y-3">
          <h3 className="text-xs font-bold text-[#171916] dark:text-[#F0F2EE] uppercase tracking-wider flex items-center gap-2">
            <Recycle className="w-3.5 h-3.5 text-[#5C7D43]" />
            Tata Cara Pembersihan Sebelum Disetor ke Bank Sampah
          </h3>
          <div className="space-y-2">
            {plastic.preparationSteps.map((step, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#1E221E] border border-[#E5E6DF] dark:border-[#2C322C] text-xs text-[#171916] dark:text-[#F0F2EE]"
              >
                <span className="w-5 h-5 rounded-full bg-[#5C7D43] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Health Warnings */}
        <div className="p-4 rounded-[16px] bg-amber-500/10 border border-amber-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide mb-1">
                Catatan Keamanan &amp; Kesehatan
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed">
                {plastic.hazardNote}
              </p>
            </div>
          </div>
        </div>

        {/* Recycling Value & Market In Demand */}
        <div className="p-4 rounded-[16px] bg-[#5C7D43]/10 border border-[#5C7D43]/20 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-[#5C7D43] dark:text-[#D8ED78] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-bold text-[#5C7D43] dark:text-[#D8ED78] uppercase tracking-wide mb-1">
                Estimasi Nilai Jual di Bank Sampah
              </h4>
              <p className="text-xs text-[#171916] dark:text-[#F0F2EE] leading-relaxed font-medium">
                {plastic.recyclingValue}
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E5E6DF] dark:border-[#2C322C]">
          <Link
            href={`/peta?plastic=${plastic.id}`}
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#5C7D43] hover:bg-[#4E6C38] text-white shadow-xs transition-all active:scale-95"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cari Bank Sampah Penerima {plastic.code}</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-full text-xs font-semibold text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
