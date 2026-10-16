'use client';

import React, { useState } from 'react';
import { PlasticType } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mapping plastic id → folder name
const FOLDER_MAP: Record<number, string> = {
  1: '1-pet',
  2: '2-hdpe',
  3: '3-pvc',
  4: '4-ldpe',
  5: '5-pp',
  6: '6-ps',
  7: '7-other',
};

const SLIDE_COUNT = 3;

interface PlasticCardProps {
  plastic: PlasticType;
  onSelect: (plastic: PlasticType) => void;
}

export default function PlasticCard({ plastic, onSelect }: PlasticCardProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  // Track per-slide error to switch to fallback independently
  const [slideErrors, setSlideErrors] = useState<boolean[]>([false, false, false]);

  const folder = FOLDER_MAP[plastic.id] ?? '1-pet';

  function goTo(idx: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSlideIndex(idx);
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setSlideIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setSlideIndex((i) => (i + 1) % SLIDE_COUNT);
  }

  function handleImgError(idx: number) {
    setSlideErrors((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }

  const currentError = slideErrors[slideIndex];

  return (
    <div 
      className="group flex flex-col justify-between bg-white dark:bg-[#1E221E] rounded-[20px] border border-[#E5E6DF] dark:border-[#2C322C] p-5 hover:border-[#5C7D43]/50 transition-all duration-300 hover:-translate-y-1 shadow-xs"
    >
      {/* ── Mini Photo Slider: Clean Specimen Studio ── */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-radial from-white via-[#F7F8F4] to-[#ECEEE6] dark:from-[#252A25] dark:via-[#1D211D] dark:to-[#141714] border border-[#E5E6DF] dark:border-[#2C322C] shadow-inner">
        {/* Subtle Specimen Badge di pojok kiri atas foto */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.1] shadow-2xs">
          <span 
            className="w-2 h-2 rounded-full shrink-0" 
            style={{ backgroundColor: plastic.color }}
          />
          <span className="text-[10px] font-mono font-bold text-[#171916] dark:text-[#F0F2EE]">
            ♳{plastic.id}
          </span>
        </div>

        {Array.from({ length: SLIDE_COUNT }).map((_, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-300 ${
              idx === slideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {!slideErrors[idx] ? (
              <div className="w-full h-full flex items-center justify-center p-3.5">
                {/* Gambar spesimen: utuh, melayang elegan dengan drop-shadow lembut */}
                <img
                  src={`/assets/plastics/${folder}/slide${idx + 1}.jpeg`}
                  alt={`${plastic.name} foto ${idx + 1}`}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-105"
                  onError={() => handleImgError(idx)}
                  draggable={false}
                />
              </div>
            ) : (
              /* Fallback placeholder jika foto belum ada */
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-2"
                style={{ backgroundColor: plastic.color + '15' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl text-white shadow-xs"
                  style={{ backgroundColor: plastic.color }}
                >
                  ♳{plastic.id}
                </div>
                <span className="text-[10px] font-medium text-[#777A73] dark:text-[#A6AFA8]">
                  Foto {idx + 1} belum tersedia
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Panah navigasi — glassmorphism bersih */}
        <button
          onClick={prev}
          aria-label="Foto sebelumnya"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-[#171916] dark:text-[#F0F2EE] backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          aria-label="Foto berikutnya"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-[#171916] dark:text-[#F0F2EE] backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots indicator & counter terintegrasi di pill kaca bawah */}
        <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/35 dark:bg-black/60 backdrop-blur-md">
            {Array.from({ length: SLIDE_COUNT }).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => goTo(idx, e)}
                aria-label={`Foto ${idx + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  idx === slideIndex
                    ? 'w-3.5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide counter badge */}
        <div className="absolute top-2 right-2 text-[9px] font-semibold bg-black/40 text-white px-1.5 py-0.5 rounded-full">
          {slideIndex + 1}/{SLIDE_COUNT}
        </div>
      </div>

      <div>
        {/* Top Header: Code & Monospace Resin Indicator */}
        <div className="flex items-start justify-between gap-3 mb-4 pb-3.5 border-b border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-base text-white shadow-xs shrink-0"
              style={{ backgroundColor: plastic.color }}
            >
              ♳{plastic.id}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#171916] dark:text-[#F0F2EE] tracking-tight group-hover:text-[#5C7D43] transition-colors">
                {plastic.code}
              </h3>
              <p className="text-[10px] text-[#777A73] dark:text-[#A6AFA8] font-medium line-clamp-1">
                {plastic.chemicalName}
              </p>
            </div>
          </div>

          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] uppercase">
            {plastic.recyclability}
          </span>
        </div>

        {/* Narrative Description */}
        <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8] leading-relaxed mb-4 line-clamp-3">
          {plastic.description}
        </p>

        {/* Common Products */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#777A73] dark:text-[#A6AFA8] block">
            Contoh Kemasan:
          </span>
          <div className="flex flex-wrap gap-1">
            {plastic.commonProducts.slice(0, 3).map((item, idx) => (
              <span 
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F2EE] dark:bg-[#121412] text-[#171916] dark:text-[#F0F2EE] font-medium"
              >
                {item}
              </span>
            ))}
            {plastic.commonProducts.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full text-[#777A73] dark:text-[#A6AFA8]">
                +{plastic.commonProducts.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Technical specs matrix */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#F1F2EE]/60 dark:bg-[#121412]/50 border border-[#E5E6DF]/50 dark:border-[#2C322C]/50 mb-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            {plastic.safeForFood ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5C7D43] shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-[#171916] dark:text-[#F0F2EE] truncate font-medium">
              {plastic.safeForFood ? 'Aman Pangan' : 'Bukan Panas'}
            </span>
          </div>

          <div className="flex items-center justify-end font-medium text-[#777A73] dark:text-[#A6AFA8]">
            Skor: <strong className="ml-1 text-[#171916] dark:text-[#F0F2EE]">{plastic.recyclabilityScore}/10</strong>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSelect(plastic)}
        className="w-full flex items-center justify-between py-2 px-3 rounded-full text-xs font-semibold text-[#171916] dark:text-[#F0F2EE] bg-[#F1F2EE] hover:bg-[#5C7D43] hover:text-white dark:bg-[#121412] dark:hover:bg-[#5C7D43] dark:hover:text-white transition-all active:scale-95 group/btn"
      >
        <span>Tata Cara Pemilahan</span>
        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
