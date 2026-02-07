import { getMostBorrowedBooks } from "@/app/actions";
import { ReportHeader, SearchFilter, PaginationControls } from "@/components/ReportUI";
import { Badge } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MostBorrowedPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string; page?: string }>;
}) {
    const params = await searchParams;
    const query = params?.query || '';
    const currentPage = Number(params?.page) || 1;

    const { data, totalPages } = await getMostBorrowedBooks(currentPage, query);

    return (
        <div>
            <ReportHeader
                title="Libros Más Prestados"
                description="Ranking de títulos populares basado en frecuencia de préstamos."
            />

            <SearchFilter placeholder="Buscar por título o autor..." />

            <div className="rounded border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 w-16 text-center">Rango</th>
                            <th className="px-4 py-3">Título</th>
                            <th className="px-4 py-3">Autor</th>
                            <th className="px-4 py-3 text-right">Total Préstamos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((book) => (
                            <tr key={book.book_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-center font-bold text-slate-700">
                                    #{book.rank_most_borrowed}
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-900">{book.title}</td>
                                <td className="px-4 py-3 text-slate-600">{book.author}</td>
                                <td className="px-4 py-3 text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {book.total_loans}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    No se encontraron libros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PaginationControls totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}
