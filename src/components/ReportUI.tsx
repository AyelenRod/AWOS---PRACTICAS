'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function ReportHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-600">{description}</p>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
        </div>
    );
}

export function SearchFilter({ placeholder = 'Buscar...' }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder={placeholder}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}

export function PaginationControls({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
    }

    return (
        <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-slate-600">
                Mostrando página <span className="font-semibold text-slate-900">{currentPage}</span> de{' '}
                <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    disabled={currentPage <= 1}
                    onClick={() => replace(createPageURL(currentPage - 1))}
                    className="p-2 rounded-lg border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>

                {pages.map((page, idx) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${idx}`} className="px-4 py-2 text-slate-400">
                                ...
                            </span>
                        );
                    }
                    
                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;
                    
                    return (
                        <button
                            key={pageNum}
                            onClick={() => replace(createPageURL(pageNum))}
                            className={`min-w-[40px] px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => replace(createPageURL(currentPage + 1))}
                    className="p-2 rounded-lg border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
                    aria-label="Página siguiente"
                >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
            </div>
        </div>
    );
}