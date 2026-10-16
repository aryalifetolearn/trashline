'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PLASTIC_DATA } from '../data/plastics';
import { MOCK_WASTE_BANKS } from '../data/mockWasteBanks';
import { INITIAL_POSTS } from '../data/mockPosts';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  Leaf, 
  BookOpen, 
  MapPin, 
  Users, 
  Check, 
  X,
  ThumbsUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [heroEmail, setHeroEmail] = useState('');
  const [heroJoined, setHeroJoined] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSubscribed, setNewsSubscribed] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [ideasCount, setIdeasCount] = useState(INITIAL_POSTS.length);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const heroSlides = [
    {
      id: 'slide-1',
      src: '/assets/hero-slides/slide1.jpeg',
      alt: 'Pemilahan sampah plastik dan botol daur ulang'
    },
    {
      id: 'slide-2',
      src: '/assets/hero-slides/slide2.jpeg',
      alt: 'Pengumpulan dan aksi nyata peduli sampah'
    },
    {
      id: 'slide-3',
      src: '/assets/hero-slides/slide3.jpeg',
      alt: 'Gerakan daur ulang dan komunitas sirkular'
    }
  ];

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const [topIdeas, setTopIdeas] = useState(INITIAL_POSTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('forum_posts');
      let allPosts = INITIAL_POSTS;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allPosts = parsed;
        }
      }
      setIdeasCount(allPosts.length);
      // Urutkan berdasarkan simpati masyarakat (upvotes terbanyak)
      const sorted = [...allPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
      setTopIdeas(sorted);
    } catch {
      const sorted = [...INITIAL_POSTS].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
      setTopIdeas(sorted);
    }
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail.trim()) setHeroJoined(true);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) setNewsSubscribed(true);
  };

  const initiatives = [
    {
      id: 'init-1',
      title: 'Clean Oceans, Bright Future',
      category: 'Ocean Cleanup',
      description: 'Removing plastic and debris from our oceans and coastlines.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop', // Sea turtle underwater
      alt: 'Sea turtle swimming in clear ocean',
      link: '/kamus'
    },
    {
      id: 'init-2',
      title: 'More Trees, Better Planet',
      category: 'Reforestation',
      description: 'Planting and restoring forests for a healthier Earth.',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop', // Waterfall lush forest
      alt: 'Dense forest with waterfall',
      link: '/kamus'
    },
    {
      id: 'init-3',
      title: 'Stronger Communities, Stronger Future',
      category: 'Community',
      description: 'Empowering communities to lead local change.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop', // Volunteers outdoor
      alt: 'Volunteers collaborating outdoors in nature',
      link: '/forum'
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-6 sm:space-y-8 py-3 sm:py-5">
      
      {/* ========================================================================= */}
      {/* SECTION A: HERO                                                           */}
      {/* ========================================================================= */}
      <section className="relative rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_8px_28px_rgba(25,30,20,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT CONTENT (44% on desktop) */}
          <div className="lg:col-span-5 space-y-5 z-10">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-[#5C7D43]" />
              <span>PLATFORM EDUKASI & AKSI SAMPAH PLASTIK</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.05]">
              Ubah <span className="text-[#5C7D43] dark:text-[#D8ED78]">Sampah</span>,<br />
              Jadi Aksi Nyata.
            </h1>

            {/* Paragraph */}
            <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-sm">
              Pelajari 7 jenis plastik dan cara pemilahannya, temukan Bank Sampah &amp; TPS terdekat, serta bagikan ide kreatif daur ulangmu bersama komunitas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/kamus"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white text-xs font-semibold tracking-tight transition-all active:scale-95 shadow-xs"
              >
                <span>Jelajahi Kamus Plastik</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/peta"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#222622] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-[#E5E6DF] dark:border-[#2C322C] text-[#171916] dark:text-[#F0F2EE] text-xs font-semibold tracking-tight transition-all active:scale-95 shadow-2xs"
              >
                <span>Cari Bank Sampah</span>
              </Link>
            </div>

            {/* Social Proof / Real Fact */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="flex -space-x-2 overflow-hidden">
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A1D1A] object-cover" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop" 
                  alt="Community avatar" 
                />
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A1D1A] object-cover" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop" 
                  alt="Community avatar" 
                />
                <img 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A1D1A] object-cover" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop" 
                  alt="Community avatar" 
                />
              </div>
              <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8]">
                Indonesia menghasilkan <strong className="text-[#171916] dark:text-[#F0F2EE]">6,8 juta ton</strong> sampah plastik/tahun — mulai dari langkah kecilmu.
              </p>
            </div>

            {/* 4 Bottom Statistic Cards (Realtime Data) */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-md">
              <Link 
                href="/kamus" 
                className="p-2.5 rounded-[10px] bg-white/90 dark:bg-[#222622]/90 border border-[#E5E6DF] dark:border-[#2C322C] text-left hover:border-[#5C7D43]/40 transition-colors block"
              >
                <div className="text-base font-bold text-[#171916] dark:text-[#F0F2EE]">{PLASTIC_DATA.length}</div>
                <div className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] font-medium leading-tight">Jenis Plastik</div>
              </Link>
              <Link 
                href="/forum" 
                className="p-2.5 rounded-[10px] bg-white/90 dark:bg-[#222622]/90 border border-[#E5E6DF] dark:border-[#2C322C] text-left hover:border-[#5C7D43]/40 transition-colors block"
              >
                <div className="text-base font-bold text-[#5C7D43] dark:text-[#D8ED78]">{ideasCount}+</div>
                <div className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] font-medium leading-tight">Ide Kreatif</div>
              </Link>
              <Link 
                href="/peta" 
                className="p-2.5 rounded-[10px] bg-white/90 dark:bg-[#222622]/90 border border-[#E5E6DF] dark:border-[#2C322C] text-left hover:border-[#5C7D43]/40 transition-colors block"
              >
                <div className="text-base font-bold text-[#171916] dark:text-[#F0F2EE]">{MOCK_WASTE_BANKS.length}+</div>
                <div className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] font-medium leading-tight">Bank Sampah</div>
              </Link>
              <div className="p-2.5 rounded-[10px] bg-white/90 dark:bg-[#222622]/90 border border-[#E5E6DF] dark:border-[#2C322C] text-left">
                <div className="text-base font-bold text-[#171916] dark:text-[#F0F2EE]">100%</div>
                <div className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] font-medium leading-tight">Akses Terbuka</div>
              </div>
            </div>

          </div>

          {/* RIGHT HERO PHOTO & FLOATING CARDS (56% on desktop) */}
          <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[500px] flex items-center justify-end">
            
            {/* Hero Image Slider Container */}
            <div className="relative w-full h-[440px] sm:h-[520px] rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-xs bg-zinc-900">
              
              {/* Slides with Crossfade */}
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === heroSlideIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
                  }`}
                  style={{ transition: 'opacity 1s ease-in-out, transform 6s ease-out' }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
              
              {/* Soft organic blend to left background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F1F2EE] via-transparent to-black/15 dark:from-[#1A1D1A] z-10 pointer-events-none" />

              {/* Dots Navigation (Pojok Kiri Bawah) */}
              <div className="absolute bottom-4 left-6 sm:left-8 z-20 flex items-center gap-1.5 bg-black/40 dark:bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === heroSlideIndex
                        ? 'w-6 h-2 bg-[#D8ED78]'
                        : 'w-2 h-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                  />
                ))}
              </div>



              {/* 3 Floating Cards (Stacked Vertically on Right) */}
              <div className="absolute right-3 sm:right-5 top-5 bottom-5 flex flex-col justify-between z-20 w-[170px] sm:w-[195px]">
                
                {/* 1. Kamus Plastik -> Link to Kamus */}
                <Link
                  href="/kamus"
                  className="p-2.5 rounded-[16px] bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-sm border border-white/80 dark:border-white/10 shadow-md flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform"
                >
                  <img
                    src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=150&auto=format&fit=crop"
                    alt="Edukasi Plastik"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-bold text-[#171916] dark:text-[#F0F2EE] truncate">Kamus Plastik</h4>
                    <p className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] leading-tight line-clamp-2">
                      Kenali 7 kode resin &amp; cara pilahnya.
                    </p>
                  </div>
                </Link>

                {/* 2. Peta Bank Sampah -> Link to Peta */}
                <Link
                  href="/peta"
                  className="p-2.5 rounded-[16px] bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-sm border border-white/80 dark:border-white/10 shadow-md flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform"
                >
                  <img
                    src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=150&auto=format&fit=crop"
                    alt="Bank Sampah"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-bold text-[#171916] dark:text-[#F0F2EE] truncate">Peta Bank Sampah</h4>
                    <p className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] leading-tight line-clamp-2">
                      Temukan TPS &amp; titik setor terdekat.
                    </p>
                  </div>
                </Link>

                {/* 3. Forum Daur Ulang -> Link to Forum */}
                <Link
                  href="/forum"
                  className="p-2.5 rounded-[16px] bg-white/95 dark:bg-[#1A1D1A]/95 backdrop-blur-sm border border-white/80 dark:border-white/10 shadow-md flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform"
                >
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=150&auto=format&fit=crop"
                    alt="Komunitas Daur Ulang"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-[11px] font-bold text-[#171916] dark:text-[#F0F2EE] truncate">Forum Komunitas</h4>
                    <p className="text-[9px] text-[#777A73] dark:text-[#A6AFA8] leading-tight line-clamp-2">
                      Berbagi ide kreatif kreasi daur ulang.
                    </p>
                  </div>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION B: MISSION                                                        */}
      {/* ========================================================================= */}
      <section id="mission" className="scroll-mt-20 sm:scroll-mt-24 rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Left Column (35% on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-[#5C7D43]" />
              <span>MISI &amp; TUJUAN KAMI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.12]">
              Mempermudah<br />
              Langkahmu Menuju<br />
              <span className="text-[#5C7D43] dark:text-[#D8ED78]">Bebas Sampah</span>.
            </h2>

            <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-sm">
              Melalui edukasi jenis plastik yang mudah dipahami, pemetaan titik Bank Sampah terdekat, serta wadah kreasi komunitas, kami membantu setiap warga mengambil peran nyata mengurangi polusi plastik.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <Link
                href="/peta"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white text-xs font-semibold tracking-tight transition-all shadow-xs"
              >
                <span>Cari Bank Sampah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/kamus"
                className="text-xs font-semibold text-[#171916] dark:text-[#F0F2EE] hover:text-[#5C7D43] transition-colors"
              >
                Buka Kamus Plastik
              </Link>
            </div>
          </div>

          {/* Right Column (3 Tall Image Cards, 65% on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Edukasi 7 Plastik -> Link to Kamus */}
            <Link
              href="/kamus"
              className="group relative h-[320px] sm:h-[350px] rounded-[18px] sm:rounded-[20px] overflow-hidden shadow-xs block"
            >
              <img
                src="/assets/mission-cards/card1.jpeg"
                alt="Edukasi 7 Jenis Plastik"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="w-8 h-8 rounded-full bg-white/95 text-[#5C7D43] flex items-center justify-center shadow-md">
                  <BookOpen className="w-4 h-4 text-[#5C7D43]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold leading-tight mb-1 text-white">
                    Edukasi<br />7 Kode Plastik
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-white/80 leading-snug">
                    Pahami kode resin agar pemilahan tepat sasaran.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 2: Setor ke Bank Sampah -> Link to Peta */}
            <Link
              href="/peta"
              className="group relative h-[320px] sm:h-[350px] rounded-[18px] sm:rounded-[20px] overflow-hidden shadow-xs block"
            >
              <img
                src="/assets/mission-cards/card2.jpeg"
                alt="Penyaluran Bank Sampah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="w-8 h-8 rounded-full bg-white/95 text-[#5C7D43] flex items-center justify-center shadow-md">
                  <MapPin className="w-4 h-4 text-[#5C7D43]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold leading-tight mb-1 text-white">
                    Penyaluran<br />Bank Sampah
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-white/80 leading-snug">
                    Temukan lokasi TPS &amp; titik setor resmi terdekat.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card 3: Kreasi & Komunitas -> Link to Forum */}
            <Link
              href="/forum"
              className="group relative h-[320px] sm:h-[350px] rounded-[18px] sm:rounded-[20px] overflow-hidden shadow-xs block"
            >
              <img
                src="/assets/mission-cards/card3.jpeg"
                alt="Kreasi dan Komunitas Daur Ulang"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="w-8 h-8 rounded-full bg-white/95 text-[#5C7D43] flex items-center justify-center shadow-md">
                  <Users className="w-4 h-4 text-[#5C7D43]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold leading-tight mb-1 text-white">
                    Kreasi &amp;<br />Komunitas
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-white/80 leading-snug">
                    Bagikan ide daur ulang &amp; saling beri inspirasi.
                  </p>
                </div>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C: 7 RESIN CODES STRIP                                            */}
      {/* ========================================================================= */}
      <section className="px-2 sm:px-4 py-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 border-y border-[#E5E6DF] dark:border-[#2C322C] text-[#777A73] dark:text-[#A6AFA8]">
          <Link 
            href="/kamus"
            className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase shrink-0 hover:text-[#5C7D43] transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#5C7D43] animate-pulse" />
            <span>KODE RESIN PLASTIK</span>
          </Link>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 w-full sm:w-auto">
            {PLASTIC_DATA.map((plastic) => (
              <Link 
                key={plastic.id}
                href="/kamus"
                className="flex items-center gap-1.5 text-xs font-semibold tracking-tight hover:text-[#5C7D43] transition-colors group"
                title={plastic.name}
              >
                <span className="w-5 h-5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] group-hover:bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#D8ED78] flex items-center justify-center text-[10px] font-bold">
                  {plastic.id}
                </span>
                <span className="text-[#171916] dark:text-[#F0F2EE] group-hover:text-[#5C7D43]">
                  {plastic.code.split(' / ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: IDE TERPOPULER KOMUNITAS                                      */}
      {/* ========================================================================= */}
      <section id="initiatives" className="rounded-[24px] sm:rounded-[28px] bg-[#F1F2EE] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] p-6 sm:p-10 lg:p-12 shadow-[0_8px_28px_rgba(25,30,20,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Left: 3 Top Community Ideas Cards (63% on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topIdeas.map((item, index) => (
              <div 
                key={item.id}
                className="group flex flex-col justify-between bg-white dark:bg-[#1E221E] rounded-[18px] border border-[#E5E6DF] dark:border-[#2C322C] overflow-hidden p-3.5 hover:border-[#5C7D43]/50 transition-all hover:-translate-y-1 shadow-xs"
              >
                <div>
                  {/* Badge Peringkat & Tag Plastik */}
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5C7D43]/10 dark:bg-[#D8ED78]/15 text-[#5C7D43] dark:text-[#D8ED78] text-[9px] font-bold">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Top #{index + 1}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[9px] font-semibold text-[#777A73] dark:text-[#A6AFA8]">
                      {item.plastic_tag}
                    </span>
                  </div>

                  {/* Judul Ide */}
                  <h3 className="font-bold text-xs sm:text-sm text-[#171916] dark:text-[#F0F2EE] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#5C7D43] transition-colors">
                    {item.title}
                  </h3>

                  {/* Ringkasan Konten */}
                  <p className="text-[10px] sm:text-[11px] text-[#777A73] dark:text-[#A6AFA8] leading-relaxed mb-3 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Penulis & Badge */}
                  <div className="flex items-center gap-1.5 text-[9px] text-[#777A73] dark:text-[#A6AFA8] pb-3 border-b border-[#E5E6DF]/60 dark:border-[#2C322C]/60 mb-3">
                    <span className="font-semibold text-[#171916] dark:text-[#F0F2EE]">{item.author.name}</span>
                    <span>·</span>
                    <span className="text-[#5C7D43] dark:text-[#D8ED78]">{item.author.badge}</span>
                  </div>
                </div>

                {/* Footer Kartu: Jumlah Upvote & Link ke Forum */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5 text-[10px] text-[#777A73] dark:text-[#A6AFA8]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#5C7D43] dark:text-[#D8ED78]">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{item.upvotes}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{item.comments_count || item.comments?.length || 0}</span>
                    </span>
                  </div>

                  <Link 
                    href="/forum"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#171916] dark:text-[#F0F2EE] hover:text-[#5C7D43] transition-colors"
                  >
                    <span>Dukung</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Narrative + Action Card (37% on desktop) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Eyebrow */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#777A73] dark:text-[#A6AFA8] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                <Leaf className="w-3.5 h-3.5 text-[#5C7D43]" />
                <span>PILIHAN MASYARAKAT</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-[#171916] dark:text-[#F0F2EE] leading-[1.12]">
              Ide Daur Ulang Paling Banyak Didukung.
            </h2>

            <p className="text-xs sm:text-sm text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
              Inovasi praktis pilihan komunitas untuk menyulap sampah plastik rumahan menjadi barang bernilai guna. Berikan dukunganmu atau bagikan eksperimen kreatifmu sendiri.
            </p>

            <div>
              <Link
                href="/forum"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171916] dark:text-[#F0F2EE] hover:text-[#5C7D43] transition-colors"
              >
                <span>Jelajahi Semua Ide di Forum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Lime-Green Community Action Card */}
            <div className="p-5 sm:p-6 rounded-[20px] bg-[#D8ED78] text-[#171916] space-y-3.5 shadow-xs">
              <h3 className="font-bold text-sm sm:text-base tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5C7D43]" />
                <span>Punya Ide Daur Ulang Sendiri?</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-[#171916]/80 leading-relaxed">
                Tuliskan cara pembuatan atau inovasi pemilahanmu di forum. Ide dengan simpati terbanyak dari masyarakat akan otomatis ditampilkan di halaman utama ini!
              </p>

              <div className="pt-1">
                <Link
                  href="/forum"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#171916] hover:bg-black text-white text-xs font-semibold tracking-tight transition-all active:scale-95"
                >
                  <span>Bagikan Ide Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
