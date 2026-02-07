import { getMemberActivity } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";
import { User, CheckCircle, XCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
    const data = await getMemberActivity();

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Actividad de Socios"
                description="Análisis de compromiso y tasa de devolución a tiempo de cada socio"
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Socio</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700">Tipo de Membresía</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Total Préstamos</th>
                                <th className="px-6 py-4 text-right font-semibold text-slate-700">Vencidos Activos</th>
                                <th className="px-6 py-4 text-left font-semibold text-slate-700 w-80">Tasa de Devolución a Tiempo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((member) => {
                                const rate = Number(member.on_time_return_rate);
                                const overdueCount = Number(member.active_overdue_count);
                                
                                let ratingConfig = {
                                    label: 'Excelente',
                                    color: 'bg-green-500',
                                    textColor: 'text-green-700',
                                    bgColor: 'bg-green-50',
                                    icon: <CheckCircle className="w-4 h-4" />
                                };
                                
                                if (rate < 50) {
                                    ratingConfig = {
                                        label: 'Necesita Mejora',
                                        color: 'bg-red-500',
                                        textColor: 'text-red-700',
                                        bgColor: 'bg-red-50',
                                        icon: <XCircle className="w-4 h-4" />
                                    };
                                } else if (rate < 80) {
                                    ratingConfig = {
                                        label: 'Regular',
                                        color: 'bg-amber-500',
                                        textColor: 'text-amber-700',
                                        bgColor: 'bg-amber-50',
                                        icon: <CheckCircle className="w-4 h-4" />
                                    };
                                }

                                return (
                                    <tr key={member.member_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{member.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {member.member_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 uppercase tracking-wide">
                                                {member.member_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-semibold text-slate-900">{member.total_loans}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {overdueCount > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    {overdueCount}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ratingConfig.textColor}`}>
                                                        {ratingConfig.icon}
                                                        {ratingConfig.label}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900">{rate.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                    <div 
                                                        className={`h-full ${ratingConfig.color} transition-all duration-500 ease-out`}
                                                        style={{ width: `${rate}%` }}
                                                    />
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

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500 bg-opacity-10 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Interpretación de Resultados</h3>
                        <p className="text-sm text-slate-600">
                            La tasa de devolución a tiempo mide el porcentaje de libros que cada socio ha devuelto 
                            antes de la fecha límite. Una tasa superior al 80% indica un comportamiento excelente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}