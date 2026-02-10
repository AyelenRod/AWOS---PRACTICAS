import { getMostBorrowedBooks } from "@/app/actions";
import { BookOpen, TrendingUp, Users, Calendar } from 'lucide-react';
import Pagination from "@/components/Pagination";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function MostBorrowedPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getMostBorrowedBooks(currentPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      {/* Banner Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#2E5AA7] to-[#1a3d7a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Libros Más Prestados</h1>
              <p className="text-white/80 text-sm">Ranking de popularidad basado en historial de préstamos</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-base font-semibold">vw_most_borrowed_books</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Total Registros</span>
              </div>
              <p className="text-lg font-semibold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Página</span>
              </div>
              <p className="text-lg font-semibold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Tabla de Resultados</h2>
          <p className="text-sm text-slate-500">Ordenados por cantidad de préstamos</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Título</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Autor</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Préstamos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {result.data.map((book, index) => {
                const globalRank = (currentPage - 1) * 10 + index + 1;
                let rankColor = 'bg-slate-400';
                if (globalRank === 1) rankColor = 'bg-[#FFA62B]';
                else if (globalRank === 2) rankColor = 'bg-[#86C5FF]';
                else if (globalRank === 3) rankColor = 'bg-[#2E5AA7]';

                return (
                  <tr key={book.book_id} className="table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${rankColor} text-white text-sm font-bold`}>
                        {globalRank}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-slate-500">{book.book_id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-800">{book.title}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{book.author}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[80px] overflow-hidden">
                          <div
                            className="h-full bg-[#2E5AA7] rounded-full"
                            style={{ width: `${Math.min((Number(book.total_loans) / 50) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-[#2E5AA7] min-w-[2.5rem] text-right">{book.total_loans}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/* Info note */}
      <div className="bg-[#E3F2FD] rounded-xl p-4 border border-[#86C5FF]/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#2E5AA7] rounded-lg">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Sobre este Reporte</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulta la vista <code className="px-1.5 py-0.5 bg-white rounded font-mono text-xs text-[#2E5AA7] border">vw_most_borrowed_books</code> que
              agrupa todos los préstamos históricos por libro y calcula el total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}