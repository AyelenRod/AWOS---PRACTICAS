import { getMostBorrowedBooks } from "@/app/actions";
import { ReportHeader, SearchFilter, PaginationControls } from "@/components/ReportUI";
import { Trophy, Medal, Award } from "lucide-react";

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
        <div className="space-y-6">
            <ReportHeader
                title="Libros Más Prestados"
                description="Ranking de títulos más populares basado en frecuencia de préstamos"
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <SearchFilter placeholder="Buscar por título o autor..." />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <th className="px-6 py-4 text-left font-semibold text-slate-700 w-24">Ranking</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Título del Libro</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Autor</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Total Préstamos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((book, index) => {
                                const rank = Number(book.rank_most_borrowed);
                                let rankIcon = null;
                                let rankColor = 'text-slate-600';
                                
                                if (rank === 1) {
                                    rankIcon = <Trophy className="w-5 h-5" />;
                                    rankColor = 'text-yellow-500';
                                } else if (rank === 2) {
                                    rankIcon = <Medal className="w-5 h-5" />;
                                    rankColor = 'text-slate-400';
                                } else if (rank === 3) {
                                    rankIcon = <Award className="w-5 h-5" />;
                                    rankColor = 'text-amber-600';
                                }

                                return (
                                    <tr key={book.book_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {rankIcon ? (
                                                    <span className={rankColor}>{rankIcon}</span>
                                                ) : (
                                                    <span className="text-lg font-bold text-slate-400">#{rank}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{book.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{book.author}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                                                {book.total_loans}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No se encontraron libros</p>
                                            <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationControls totalPages={totalPages} currentPage={currentPage} />
        </div>
    );
}

function BookOpen({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}