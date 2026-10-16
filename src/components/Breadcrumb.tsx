'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#777A73] dark:text-[#A6AFA8] py-1">
      <Link 
        href="/" 
        className="inline-flex items-center gap-1 hover:text-[#5C7D43] dark:hover:text-[#D8ED78] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Beranda</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-[#A6AFA8] dark:text-[#555C54] shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-[#171916] dark:text-[#F0F2EE] truncate">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-[#5C7D43] dark:hover:text-[#D8ED78] transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
