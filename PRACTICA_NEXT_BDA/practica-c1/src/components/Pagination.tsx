'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, '...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...', totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Página <span className="font-bold text-[#2E5AA7]">{currentPage}</span> de{' '}
        <span className="font-bold text-[#2E5AA7]">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1">
        <Link href={createPageURL(1)} className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#2E5AA7] hover:bg-[#E3F2FD]'}`} aria-disabled={currentPage === 1}>
          <ChevronsLeft size={18} />
        </Link>
        <Link href={createPageURL(Math.max(1, currentPage - 1))} className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#2E5AA7] hover:bg-[#E3F2FD]'}`} aria-disabled={currentPage === 1}>
          <ChevronLeft size={18} />
        </Link>
        <div className="flex items-center">
          {getPageNumbers().map((page, index) => {
            if (page === '...') return <span key={`e-${index}`} className="px-2 py-1 text-slate-400 text-sm">...</span>;
            const p = page as number;
            return (
              <Link key={p} href={createPageURL(p)} className={`min-w-[2rem] px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === currentPage ? 'bg-[#2E5AA7] text-white shadow-md' : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#E3F2FD]'}`}>
                {p}
              </Link>
            );
          })}
        </div>
        <Link href={createPageURL(Math.min(totalPages, currentPage + 1))} className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#2E5AA7] hover:bg-[#E3F2FD]'}`} aria-disabled={currentPage === totalPages}>
          <ChevronRight size={18} />
        </Link>
        <Link href={createPageURL(totalPages)} className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#2E5AA7] hover:bg-[#E3F2FD]'}`} aria-disabled={currentPage === totalPages}>
          <ChevronsRight size={18} />
        </Link>
      </div>
    </div>
  );
}