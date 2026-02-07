import { getOverdueLoans } from "@/app/actions";
import { ReportHeader, PaginationControls } from "@/components/ReportUI";
import Link from "next/link";
import { Calendar, AlertTriangle } from "lucide-react";

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
        <div className="space-y-6">
            <ReportHeader
                title="Préstamos Vencidos"
                description="Préstamos activos que han superado su fecha de devolución"
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-wrap gap-3">
                    <FilterButton href="?days=0" label="Todos" active={minDays === 0} count={data.length} />
                    <FilterButton href="?days=7" label="Más de 7 días" active={minDays === 7} />
                    <FilterButton href="?days=14" label="Más de 14 días" active={minDays === 14} />
                    <FilterButton href="?days=30" label="Crítico (30+ días)" active={minDays === 30} variant="danger" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Socio</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Libro</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Fecha Vencimiento</th>
                                <th className="px-6 py-4 text-center font-semibold text-slate-700">Días de Atraso</th>
                                <th className="px-6 py-4 text-center font-semibold text-slate-700">Nivel de Urgencia</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Multa Estimada</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((loan) => {
                                const urgencyConfig = {
                                    CRITICAL: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
                                    HIGH: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
                                    NORMAL: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
                                };
                                const config = urgencyConfig[loan.urgency_level as keyof typeof urgencyConfig] || urgencyConfig.NORMAL;

                                return (
                                    <tr key={loan.loan_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{loan.member_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600 max-w-xs truncate">{loan.book_title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(loan.due_at).toLocaleDateString('es-ES', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                                                {loan.days_overdue} días
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
                                                {loan.urgency_level === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                                                {loan.urgency_level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-mono font-semibold text-slate-900">
                                                ${Number(loan.estimated_fine_amount).toFixed(2)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No hay préstamos vencidos</p>
                                            <p className="text-xs mt-1">Todos los préstamos están al día</p>
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

function FilterButton({ href, label, active, count, variant = 'default' }: { 
    href: string; 
    label: string; 
    active: boolean; 
    count?: number;
    variant?: 'default' | 'danger';
}) {
    const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
    const variantClasses = variant === 'danger' 
        ? active 
            ? 'bg-red-600 text-white shadow-md' 
            : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
        : active 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';

    return (
        <Link href={href} replace className={`${baseClasses} ${variantClasses}`}>
            {label}
            {count !== undefined && active && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                    {count}
                </span>
            )}
        </Link>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}