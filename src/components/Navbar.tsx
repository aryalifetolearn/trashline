'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Misi Kami', href: '/#mission' },
    { name: 'Kamus Plastik', href: '/kamus' },
    { name: 'Peta Bank Sampah', href: '/peta' },
    { name: 'Forum Komunitas', href: '/forum' },
    { name: 'Lencana & Peringkat', href: '/peringkat' },
  ];

  return (
    <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-2 z-50">
      <div className="flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 text-[#5C7D43] transition-transform group-hover:scale-105" 
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
          <span className="font-semibold text-xl tracking-tight text-[#171916] dark:text-[#F0F2EE]">
            Trashline
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
          {navLinks.map((link) => {
            const isCurrent = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-[13px] transition-all px-3.5 py-1.5 rounded-full ${
                  isCurrent 
                    ? 'bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#D8ED78] font-semibold shadow-xs' 
                    : 'text-[#777A73] dark:text-[#A6AFA8] hover:text-[#171916] dark:hover:text-[#F0F2EE] font-medium'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth / CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {(profile?.role === 'admin' || profile?.role === 'operator') && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5C7D43] text-white hover:bg-[#4E6C38] transition-all text-xs font-semibold shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{profile.role === 'admin' ? 'Portal DLH' : 'Portal Mitra'}</span>
                </Link>
              )}
              <Link
                href="/peringkat"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5C7D43]/10 hover:bg-[#5C7D43]/20 text-[#5C7D43] dark:text-[#D8ED78] transition-all text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-[#5C7D43] text-white flex items-center justify-center text-[11px] font-bold">
                  {profile?.name?.charAt(0) || user.email?.charAt(0) || 'W'}
                </div>
                <span className="max-w-[120px] truncate">{profile?.name || user.email?.split('@')[0]}</span>
              </Link>
              <button
                onClick={signOut}
                title="Keluar (Logout)"
                className="p-2 rounded-full text-[#777A73] hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-[#5C7D43] hover:bg-[#4E6C38] text-white text-[13px] font-semibold tracking-tight transition-all shadow-xs hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk / Daftar</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#171916] dark:text-[#F0F2EE] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-2 p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1D1A] border border-[#E5E6DF] dark:border-[#2C322C] shadow-lg space-y-2">
          {navLinks.map((link) => {
            const isCurrent = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                  isCurrent
                    ? 'bg-[#5C7D43]/10 text-[#5C7D43] dark:text-[#D8ED78] font-bold'
                    : 'text-[#171916] dark:text-[#F0F2EE] hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <span>{link.name}</span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-[#5C7D43] dark:bg-[#D8ED78]" />}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-[#E5E6DF]/70 dark:border-[#2C322C]/70">
            {user ? (
              <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-[#F7F7F4] dark:bg-[#121412]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#5C7D43] text-white flex items-center justify-center text-xs font-bold">
                      {profile?.name?.charAt(0) || 'W'}
                    </div>
                    <div className="text-xs">
                      <strong className="block text-[#171916] dark:text-[#F0F2EE] leading-tight truncate max-w-[140px]">{profile?.name}</strong>
                      <span className="text-[10px] text-[#777A73]">{profile?.badge || 'Pemula Hijau'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 hover:bg-red-500/10"
                  >
                    Keluar
                  </button>
                </div>
                {(profile?.role === 'admin' || profile?.role === 'operator') && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#5C7D43] text-white text-xs font-semibold shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Buka {profile.role === 'admin' ? 'Portal Pengawas DLH' : 'Portal Mitra Timbang'}</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#5C7D43] text-white text-xs font-semibold shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk / Daftar Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
