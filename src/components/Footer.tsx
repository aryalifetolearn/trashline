import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 mt-8 text-[#171916] dark:text-[#F0F2EE]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
        
        {/* Brand Col */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <svg 
              viewBox="0 0 24 24" 
              className="w-6 h-6 text-[#5C7D43]" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9" />
              <path d="M12 12c-2-2-3-4-3-6 0-1.66 1.34-3 3-3s3 1.34 3 3c0 2-1 4-3 6z" fill="#5C7D43" fillOpacity="0.2" />
              <path d="M12 12v9" />
            </svg>
            <span className="font-semibold text-lg tracking-tight">Trashline</span>
          </Link>
          <p className="text-[13px] text-[#777A73] dark:text-[#A6AFA8] leading-relaxed max-w-xs">
            Garis panduan sirkular untuk mengidentifikasi jenis plastik, menemukan Bank Sampah terdekat, dan berbagi ide kreatif daur ulang demi masa depan bebas polusi.
          </p>
        </div>

        {/* Fitur Utama */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[13px] font-semibold text-[#171916] dark:text-[#F0F2EE]">Fitur Utama</h4>
          <ul className="space-y-2 text-[13px] text-[#777A73] dark:text-[#A6AFA8]">
            <li><Link href="/kamus" className="hover:text-[#5C7D43] transition-colors">Kamus 7 Plastik</Link></li>
            <li><Link href="/peta" className="hover:text-[#5C7D43] transition-colors">Peta Bank Sampah</Link></li>
            <li><Link href="/forum" className="hover:text-[#5C7D43] transition-colors">Forum Komunitas</Link></li>
            <li><Link href="/peringkat" className="hover:text-[#5C7D43] transition-colors">Papan Peringkat</Link></li>
          </ul>
        </div>

        {/* Panduan & Aksi */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[13px] font-semibold text-[#171916] dark:text-[#F0F2EE]">Panduan &amp; Aksi</h4>
          <ul className="space-y-2 text-[13px] text-[#777A73] dark:text-[#A6AFA8]">
            <li><Link href="/kamus" className="hover:text-[#5C7D43] transition-colors">Tata Cara Pemilahan</Link></li>
            <li><Link href="/kamus" className="hover:text-[#5C7D43] transition-colors">Tips Bersih &amp; Kering</Link></li>
            <li><Link href="/forum" className="hover:text-[#5C7D43] transition-colors">Bagikan Ide DIY</Link></li>
            <li><Link href="/peta" className="hover:text-[#5C7D43] transition-colors">Titik TPS Terdekat</Link></li>
          </ul>
        </div>

        {/* Tentang Kami */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[13px] font-semibold text-[#171916] dark:text-[#F0F2EE]">Tentang</h4>
          <ul className="space-y-2 text-[13px] text-[#777A73] dark:text-[#A6AFA8]">
            <li><Link href="/#mission" className="hover:text-[#5C7D43] transition-colors">Misi Trashline</Link></li>
            <li><Link href="/#initiatives" className="hover:text-[#5C7D43] transition-colors">Karya Terpopuler</Link></li>
            <li><Link href="/peringkat" className="hover:text-[#5C7D43] transition-colors">Sistem Lencana</Link></li>
            <li><Link href="/forum" className="hover:text-[#5C7D43] transition-colors">Kontak Komunitas</Link></li>
            <li><Link href="/admin" className="hover:text-[#5C7D43] transition-colors font-medium text-[#5C7D43] dark:text-[#D8ED78]">Portal Pengelola (Admin)</Link></li>
          </ul>
        </div>

        {/* Komitmen & Inisiatif Terbuka */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[13px] font-semibold text-[#171916] dark:text-[#F0F2EE]">Komitmen</h4>
          <p className="text-[12px] text-[#777A73] dark:text-[#A6AFA8] leading-relaxed">
            Platform swadaya terbuka tanpa biaya. Didedikasikan untuk edukasi lingkungan dan literasi persampahan Indonesia.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#D8ED78] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C7D43] animate-pulse" />
              Inisiatif Swadaya
            </span>
          </div>
          <p className="text-[11px] text-[#777A73] dark:text-[#A6AFA8] pt-2">
            © 2026 Trashline. Semua hak dilindungi.
          </p>
        </div>

      </div>
    </footer>
  );
}
