import { getMemberActivity } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
    const data = await getMemberActivity();

    return (
        <div>
            <ReportHeader
                title="Actividad de Socios"
                description="Análisis de compromiso y confiabilidad de devolución."
            />

            <div className="rounded border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Nombre Socio</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3 text-right">Total Préstamos</th>
                            <th className="px-4 py-3 text-right">Vencidos Activos</th>
                            <th className="px-4 py-3 w-1/4">Confiabilidad (Devolución a Tiempo)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((m) => {
                            const rate = Number(m.on_time_return_rate);
                            let color = 'bg-green-500';
                            if (rate < 50) color = 'bg-red-500';
                            else if (rate < 80) color = 'bg-yellow-500';

                            return (
                                <tr key={m.member_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                                    <td className="px-4 py-3 text-xs uppercase tracking-wider text-slate-500">{m.member_type}</td>
                                    <td className="px-4 py-3 text-right">{m.total_loans}</td>
                                    <td className="px-4 py-3 text-right">
                                        {Number(m.active_overdue_count) > 0 ? (
                                            <span className="text-red-600 font-bold">{m.active_overdue_count}</span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs w-10 text-right font-mono">{rate}%</span>
                                            <div className="w-full bg-slate-100 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${color}`} style={{ width: `${rate}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
