'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, MapPin, Lightbulb, Trophy } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Kamus', href: '/kamus', icon: BookOpen },
    { label: 'Peta', href: '/peta', icon: MapPin },
    { label: 'Forum', href: '/forum', icon: Lightbulb },
    { label: 'Peringkat', href: '/peringkat', icon: Trophy },
  ];

  return (
    <nav 
      aria-label="Navigasi Bawah Layar" 
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 dark:bg-[#181B18]/95 backdrop-blur-lg border-t border-[#E5E6DF] dark:border-[#2C322C] shadow-[0_-6px_24px_rgba(20,25,18,0.06)] px-2 pt-1.5 pb-2"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#5C7D43] dark:text-[#D8ED78] font-bold scale-105'
                  : 'text-[#777A73] dark:text-[#8E958C] hover:text-[#171916] dark:hover:text-[#F0F2EE] font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-[#5C7D43]/15 text-[#5C7D43] dark:text-[#D8ED78]' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#5C7D43] dark:bg-[#D8ED78]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
