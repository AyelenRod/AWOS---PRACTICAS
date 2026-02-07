import { getFinesSummary } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";
import { redirect } from "next/navigation";

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
        <div>
            <ReportHeader
                title="Resumen de Multas"
                description="Desglose mensual de multas generadas, pagadas y pendientes."
            />

            <div className="bg-white p-4 rounded border border-slate-200 mb-6">
                <form action={filterAction} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Mes Inicio</label>
                        <input type="month" name="start" defaultValue={start} className="border border-slate-300 rounded px-2 py-1 text-sm bg-slate-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Mes Fin</label>
                        <input type="month" name="end" defaultValue={end} className="border border-slate-300 rounded px-2 py-1 text-sm bg-slate-50" />
                    </div>
                    <button type="submit" className="bg-slate-900 text-white px-4 py-1.5 rounded text-sm hover:bg-slate-800 transition-colors">
                        Filtrar
                    </button>
                    {(start || end) && (
                        <a href="/reports/fines" className="text-sm text-slate-500 hover:text-red-600 underline self-center">Resetear</a>
                    )}
                </form>
            </div>

            <div className="rounded border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Mes</th>
                            <th className="px-4 py-3 text-right">Total Multas Emitidas</th>
                            <th className="px-4 py-3 text-right">Monto Total</th>
                            <th className="px-4 py-3 text-right text-green-600">Cobrado</th>
                            <th className="px-4 py-3 text-right text-red-600">Pendiente</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row) => (
                            <tr key={row.month_str} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">{row.month_str}</td>
                                <td className="px-4 py-3 text-right">{row.total_fines_count}</td>
                                <td className="px-4 py-3 text-right font-mono">${Number(row.total_amount_generated).toFixed(2)}</td>
                                <td className="px-4 py-3 text-right font-mono text-green-600 font-medium">
                                    ${Number(row.total_paid).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-red-600 font-medium">
                                    ${Number(row.total_pending).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    No se encontraron multas para este periodo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
