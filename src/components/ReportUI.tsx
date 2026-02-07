'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function ReportHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <p className="text-slate-500">{description}</p>
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
        <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
                className="pl-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

    return (
        <div className="flex items-center gap-2 mt-6 justify-end">
            <span className="text-sm text-slate-500 mr-2">
                Página {currentPage} de {totalPages}
            </span>
            <button
                disabled={currentPage <= 1}
                onClick={() => replace(createPageURL(currentPage - 1))}
                className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} />
            </button>
            <button
                disabled={currentPage >= totalPages}
                onClick={() => replace(createPageURL(currentPage + 1))}
                className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}
