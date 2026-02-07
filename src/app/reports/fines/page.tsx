import { getFinesSummary } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";
import { redirect } from "next/navigation";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function FinesPage({
    searchParams,
}: {
    searchParams?: Promise<{ start?: string; end?: string }>;
}) {
    const params = await searchParams;
    const start = params?.start || '';
    const end = params?.end || '';

    const data = await getFinesSummary(start, end);

    const totals = data.reduce((acc, row) => ({
        fines: acc.fines + Number(row.total_fines_count),
        generated: acc.generated + Number(row.total_amount_generated),
        paid: acc.paid + Number(row.total_paid),
        pending: acc.pending + Number(row.total_pending),
    }), { fines: 0, generated: 0, paid: 0, pending: 0 });

    async function filterAction(formData: FormData) {
        'use server';
        const s = formData.get('start')?.toString();
        const e = formData.get('end')?.toString();
        const q = new URLSearchParams();
        if (s) q.set('start', s);
        if (e) q.set('end', e);
        redirect(`/reports/fines?${q.toString()}`);
    }

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Resumen de Multas"
                description="Desglose mensual de multas generadas, cobradas y pendientes"
            />

            <div className="grid gap-4 md:grid-cols-3">
                <SummaryCard
                    title="Total Generado"
                    value={`$${totals.generated.toFixed(2)}`}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="bg-slate-500"
                />
                <SummaryCard
                    title="Total Cobrado"
                    value={`$${totals.paid.toFixed(2)}`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="bg-green-500"
                />
                <SummaryCard
                    title="Total Pendiente"
                    value={`$${totals.pending.toFixed(2)}`}
                    icon={<TrendingDown className="w-5 h-5" />}
                    color="bg-red-500"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <form action={filterAction} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Periodo Inicio</label>
                        <input 
                            type="month" 
                            name="start" 
                            defaultValue={start} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Periodo Fin</label>
                        <input 
                            type="month" 
                            name="end" 
                            defaultValue={end} 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Aplicar Filtro
                    </button>
                    {(start || end) && (
                        <a 
                            href="/reports/fines" 
                            className="px-6 py-2 text-slate-600 hover:text-red-600 font-medium transition-colors underline"
                        >
                            Limpiar
                        </a>
                    )}
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Periodo (Mes)</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Multas Emitidas</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Monto Total</th>
                                <th className="px-6 py-4 text-right font-semibold text-green-700">Cobrado</th>
                                <th className="px-6 py-4 text-right font-semibold text-red-700">Pendiente</th>
                                <th className="px-6 py-4 text-center font-semibold text-slate-700">% Cobrado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row) => {
                                const percentPaid = (Number(row.total_paid) / Number(row.total_amount_generated) * 100) || 0;
                                
                                return (
                                    <tr key={row.month_str} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">{row.month_str}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {row.total_fines_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">
                                            ${Number(row.total_amount_generated).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-semibold text-green-700">
                                            ${Number(row.total_paid).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-semibold text-red-700">
                                            ${Number(row.total_pending).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-24 bg-slate-100 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${percentPaid >= 70 ? 'bg-green-500' : percentPaid >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${percentPaid}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-600 w-12 text-right">
                                                    {percentPaid.toFixed(0)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <p className="text-sm font-medium">No se encontraron multas</p>
                                            <p className="text-xs mt-1">Intenta con otro rango de fechas</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon, color }: { 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    color: string; 
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${color} bg-opacity-10 rounded-lg`}>
                    <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}