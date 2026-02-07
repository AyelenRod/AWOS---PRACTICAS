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

  // Generar array de números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Número máximo de botones visibles

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 4) {
        // Inicio: 1 2 3 4 5 ... 10
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Final: 1 ... 6 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Medio: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Página <span className="font-bold text-[#2E5AA7]">{currentPage}</span> de{' '}
        <span className="font-bold text-[#2E5AA7]">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Primera página */}
        <Link
          href={createPageURL(1)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#2E5AA7]/10'
          }`}
          aria-disabled={currentPage === 1}
        >
          <ChevronsLeft size={20} />
        </Link>

        {/* Página anterior */}
        <Link
          href={createPageURL(Math.max(1, currentPage - 1))}
          className={`p-2 rounded-xl transition-all duration-300 ${
            currentPage === 1
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#2E5AA7]/10'
          }`}
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </Link>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Link
                key={pageNum}
                href={createPageURL(pageNum)}
                className={`min-w-[2.5rem] px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] text-white shadow-lg shadow-[#2E5AA7]/30 scale-110'
                    : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#2E5AA7]/10'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Página siguiente */}
        <Link
          href={createPageURL(Math.min(totalPages, currentPage + 1))}
          className={`p-2 rounded-xl transition-all duration-300 ${
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#2E5AA7]/10'
          }`}
          aria-disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </Link>

        {/* Última página */}
        <Link
          href={createPageURL(totalPages)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            currentPage === totalPages
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-600 hover:text-[#2E5AA7] hover:bg-[#2E5AA7]/10'
          }`}
          aria-disabled={currentPage === totalPages}
        >
          <ChevronsRight size={20} />
        </Link>
      </div>
    </div>
  );
}