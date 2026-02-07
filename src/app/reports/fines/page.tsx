import { getFinesSummary } from "@/app/actions";
import { DollarSign, TrendingDown, TrendingUp, Users, AlertCircle } from 'lucide-react';
import Pagination from "@/components/Pagination";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function FinesPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getFinesSummary(currentPage);

  const totalPending = result.data.reduce((acc, curr) => acc + Number(curr.total_pending), 0);
  const totalPaid = result.data.reduce((acc, curr) => acc + Number(curr.total_paid), 0);
  const totalFines = totalPending + totalPaid;
  const collectionRate = totalFines > 0 ? (totalPaid / totalFines) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <DollarSign className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Resumen de Multas por Socio</h1>
              <p className="text-white/90 text-lg">Estado financiero de penalizaciones y cobros</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-xl font-bold">vw_fines_summary</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Total Multas</span>
              </div>
              <p className="text-2xl font-bold">${totalFines.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Pendiente</span>
              </div>
              <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Tasa Cobro</span>
              </div>
              <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-l-4 border-emerald-500 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">PAGADO</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">${totalPaid.toFixed(2)}</div>
          <div className="text-sm text-slate-500">Total recaudado</div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">PENDIENTE</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">${totalPending.toFixed(2)}</div>
          <div className="text-sm text-slate-500">Por cobrar</div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${100 - collectionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-[#2E5AA7] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#2E5AA7]/10 rounded-xl">
              <Users className="w-6 h-6 text-[#2E5AA7]" />
            </div>
            <span className="text-xs font-bold text-[#2E5AA7] bg-[#2E5AA7]/10 px-3 py-1 rounded-full">SOCIOS</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{result.totalRecords}</div>
          <div className="text-sm text-slate-500">Con multas registradas</div>
          <div className="mt-4 text-xs text-slate-400">Total acumulado histórico</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="text-2xl font-bold text-slate-900">Detalle por Socio</h2>
          <p className="text-slate-600 mt-2">Resumen financiero agregado de todas las multas por miembro</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID Socio</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Total Multas</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Pagado</th>
                <th className="px-8 py-5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Pendiente</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((fine) => {
                const total = Number(fine.total_pending) + Number(fine.total_paid);
                const pending = Number(fine.total_pending);
                const paid = Number(fine.total_paid);
                const paymentRate = total > 0 ? (paid / total) * 100 : 0;

                return (
                  <tr key={fine.member_id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200 group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm font-semibold text-slate-700">{fine.member_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#2E5AA7] to-[#86C5FF] rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">{fine.member_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-600">{fine.member_email}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-lg font-bold text-slate-900">${total.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-emerald-600 font-semibold">${paid.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-red-600 font-semibold">${pending.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center gap-2">
                        {pending === 0 ? (
                          <span className="inline-flex px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                            ✓ SALDADO
                          </span>
                        ) : paymentRate >= 50 ? (
                          <span className="inline-flex px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg">
                            PARCIAL
                          </span>
                        ) : (
                          <span className="inline-flex px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
                            PENDIENTE
                          </span>
                        )}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${paymentRate}%` }}
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

        <div className="p-8 border-t border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">Sobre este Reporte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
                Este reporte consulta la vista <code className="px-2 py-1 bg-white rounded font-mono text-xs text-emerald-600 border border-emerald-200">vw_fines_summary</code> que 
                agrupa todas las multas por socio y calcula: SUM(amount) AS total_fines, SUM(IF(status=&apos;paid&apos;, amount, 0)) AS total_paid, 
                y SUM(IF(status=&apos;pending&apos;, amount, 0)) AS total_pending. Incluye información del socio mediante JOIN con la tabla members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}