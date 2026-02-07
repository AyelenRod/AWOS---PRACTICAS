import { getOverdueLoans } from "@/app/actions";
import { ReportHeader, PaginationControls } from "@/components/ReportUI";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OverduePage({
    searchParams,
}: {
    searchParams?: Promise<{ days?: string; page?: string }>;
}) {
    const params = await searchParams;
    const minDays = Number(params?.days) || 0;
    const currentPage = Number(params?.page) || 1;

    const { data, totalPages } = await getOverdueLoans(currentPage, minDays);

    return (
        <div>
            <ReportHeader
                title="Préstamos Vencidos"
                description="Préstamos activos que han pasado su fecha de devolución."
            />

            <div className="flex gap-2 mb-4">
                <Link replace href="?days=0" className={`px-3 py-1 rounded-full text-xs font-medium border ${minDays === 0 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>Todos</Link>
                <Link replace href="?days=7" className={`px-3 py-1 rounded-full text-xs font-medium border ${minDays === 7 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>&gt; 7 Días</Link>
                <Link replace href="?days=30" className={`px-3 py-1 rounded-full text-xs font-medium border ${minDays === 30 ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>Crítico (&gt; 30 Días)</Link>
            </div>

            <div className="rounded border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Socio</th>
                            <th className="px-4 py-3">Libro</th>
                            <th className="px-4 py-3">Fecha Vencimiento</th>
                            <th className="px-4 py-3 text-center">Días Atraso</th>
                            <th className="px-4 py-3 text-center">Urgencia</th>
                            <th className="px-4 py-3 text-right">Multa Est.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((loan) => (
                            <tr key={loan.loan_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{loan.member_name}</td>
                                <td className="px-4 py-3 text-slate-600">{loan.book_title}</td>
                                <td className="px-4 py-3 text-slate-500">
                                    {new Date(loan.due_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-red-600">
                                    {loan.days_overdue}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${loan.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                        loan.urgency_level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {loan.urgency_level}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-slate-700">
                                    ${Number(loan.estimated_fine_amount).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    No se encontraron préstamos vencidos con este criterio.
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
