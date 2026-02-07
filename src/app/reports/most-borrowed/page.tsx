import { getMostBorrowedBooks } from "@/app/actions";
import { BookOpen, TrendingUp, Users, Calendar } from 'lucide-react';
import Pagination from "@/app/components/Pagination";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function MostBorrowedPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getMostBorrowedBooks(currentPage);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#2E5AA7] via-[#2E5AA7] to-[#1e3a5f] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#86C5FF] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA62B] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="w-10 h-10 text-[#FFA62B]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Libros Más Prestados</h1>
              <p className="text-white/80 text-lg">Ranking de popularidad basado en historial completo de préstamos</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-2xl font-bold">vw_most_borrowed_books</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Total Registros</span>
              </div>
              <p className="text-2xl font-bold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Página Actual</span>
              </div>
              <p className="text-2xl font-bold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-2xl font-bold text-slate-900">Tabla de Resultados</h2>
          <p className="text-slate-600 mt-2">Ordenados por cantidad de préstamos históricos (mayor a menor)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Ranking</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Título</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Autor</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ISBN</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Categoría</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total Préstamos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((book, index) => {
                const globalRank = (currentPage - 1) * 10 + index + 1;
                let rankColor = 'from-slate-400 to-slate-500';
                
                if (globalRank === 1) rankColor = 'from-yellow-400 to-yellow-500';
                else if (globalRank === 2) rankColor = 'from-slate-300 to-slate-400';
                else if (globalRank === 3) rankColor = 'from-amber-600 to-amber-700';
                else if (globalRank <= 10) rankColor = 'from-[#2E5AA7] to-[#86C5FF]';

                return (
                  <tr key={book.book_id} className="hover:bg-gradient-to-r hover:from-[#2E5AA7]/5 hover:to-[#86C5FF]/5 transition-all duration-200 group">
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${rankColor} text-white font-bold shadow-lg`}>
                        #{globalRank}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm text-slate-500">{book.book_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-semibold text-slate-900 group-hover:text-[#2E5AA7] transition-colors">{book.title}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-600">{book.author}</td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm text-slate-500">{book.isbn}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F8E6A0] to-[#FFA62B]/30 text-slate-700 border border-[#FFA62B]/20">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((Number(book.total_loans) / 50) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-[#2E5AA7] min-w-[3rem] text-right">{book.total_loans}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-8 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-[#2E5AA7]/10 to-[#86C5FF]/10 rounded-2xl p-6 border border-[#2E5AA7]/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#2E5AA7] rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">Sobre este Reporte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Este reporte consulta la vista <code className="px-2 py-1 bg-white rounded font-mono text-xs text-[#2E5AA7] border border-[#2E5AA7]/20">vw_most_borrowed_books</code> que 
              agrupa todos los préstamos históricos por libro y calcula el total. Los datos están ordenados por popularidad (total_loans DESC) 
              e incluyen información completa del libro desde la tabla books mediante un JOIN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}