import { getMostBorrowedBooks } from "@/app/actions";
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
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[#2E5AA7] font-bold hover:underline">
        ← Volver al Dashboard
      </Link>

      {/* Encabezado */}
      <div className="rounded-2xl p-6 bg-[#2E5AA7] text-white">
        <h1 className="text-2xl font-bold">Libros Más Prestados</h1>
        <p className="text-white/80 text-sm mt-1">Ranking de popularidad basado en historial de préstamos</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <span className="text-[10px] text-white/60 uppercase font-bold block mb-1">Vista SQL</span>
            <p className="text-sm font-semibold truncate">vw_most_borrowed_books</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <span className="text-[10px] text-white/60 uppercase font-bold block mb-1">Total Libros</span>
            <p className="text-lg font-bold">{result.totalRecords}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20">
            <span className="text-[10px] text-white/60 uppercase font-bold block mb-1">Página Actual</span>
            <p className="text-lg font-bold">{currentPage} de {result.totalPages}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Ranking de Libros</h2>
          <p className="text-xs text-slate-500">Listado de los más solicitados por los socios</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
                <th className="px-5 py-4 text-left">Posición</th>
                <th className="px-5 py-4 text-left">ID</th>
                <th className="px-5 py-4 text-left">Título del Libro</th>
                <th className="px-5 py-4 text-left">Autor</th>
                <th className="px-5 py-4 text-right">Préstamos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((book, index) => {
                const globalRank = (currentPage - 1) * 10 + index + 1;
                
                let rankBg = 'bg-slate-100 text-slate-500';
                if (globalRank === 1) rankBg = 'bg-[#FFA62B] text-white';
                if (globalRank === 2) rankBg = 'bg-[#86C5FF] text-white';
                if (globalRank === 3) rankBg = 'bg-[#2E5AA7] text-white';

                return (
                  <tr key={book.book_id} className="text-slate-700">
                    <td className="px-5 py-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${rankBg}`}>
                        {globalRank}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">
                      {book.book_id}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {book.title}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {book.author}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
              
                        <div className="hidden sm:block w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#2E5AA7]" 
                            style={{ width: `${Math.min((Number(book.total_loans) / 50) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-base font-bold text-[#2E5AA7]">
                          {book.total_loans}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/* Pie de Pagina */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          Información procesada desde: <span className="text-[#2E5AA7]">vw_most_borrowed_books</span>
        </p>
      </div>
    </div>
  );
}