import { getFinesSummary } from "@/app/actions";
import { DollarSign, TrendingDown, TrendingUp, Users, AlertCircle } from 'lucide-react';
import Pagination from "@/components/Pagination";
import Link from "next/link";

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
    <div className="space-y-6 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      {/* Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#FFA62B] to-[#E8941F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resumen de Multas</h1>
              <p className="text-white/80 text-sm">Estado financiero de penalizaciones y cobros</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-base font-semibold">vw_fines_summary</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Total Multas</span>
              </div>
              <p className="text-lg font-semibold">${totalFines.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Pendiente</span>
              </div>
              <p className="text-lg font-semibold">${totalPending.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Tasa Cobro</span>
              </div>
              <p className="text-lg font-semibold">{collectionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border-l-4 border-emerald-500 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">PAGADO</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-0.5">${totalPaid.toFixed(2)}</div>
          <div className="text-xs text-slate-500">Total recaudado</div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-l-4 border-[#EF4444] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <span className="text-[10px] font-bold text-[#EF4444] bg-red-50 px-2 py-0.5 rounded-full">PENDIENTE</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-0.5">${totalPending.toFixed(2)}</div>
          <div className="text-xs text-slate-500">Por cobrar</div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${100 - collectionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border-l-4 border-[#2E5AA7] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-[#E3F2FD] rounded-lg">
              <Users className="w-5 h-5 text-[#2E5AA7]" />
            </div>
            <span className="text-[10px] font-bold text-[#2E5AA7] bg-[#E3F2FD] px-2 py-0.5 rounded-full">SOCIOS</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 mb-0.5">{result.totalRecords}</div>
          <div className="text-xs text-slate-500">Con multas registradas</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Detalle por Mes</h2>
          <p className="text-sm text-slate-500">Resumen financiero de multas por período</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mes</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Cantidad</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Generado</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Pagado</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Pendiente</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {result.data.map((fine) => {
                const pending = Number(fine.total_pending);
                const paid = Number(fine.total_paid);
                const total = pending + paid;
                const paymentRate = total > 0 ? (paid / total) * 100 : 0;

                return (
                  <tr key={fine.month_str} className="table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-800 text-sm">{fine.month_str}</span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-slate-600">{fine.total_fines_count}</td>
                    <td className="px-5 py-4 text-right text-base font-bold text-slate-800">${total.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-semibold text-sm">${paid.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right text-[#EF4444] font-semibold text-sm">${pending.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        {pending === 0 ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">SALDADO</span>
                        ) : paymentRate >= 50 ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFA62B] text-white">PARCIAL</span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">PENDIENTE</span>
                        )}
                        <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${paymentRate}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/* Info note */}
      <div className="bg-[#FFF8ED] rounded-xl p-4 border border-[#FFA62B]/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#FFA62B] rounded-lg">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Sobre este Reporte</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulta la vista <code className="px-1.5 py-0.5 bg-white rounded font-mono text-xs text-[#FFA62B] border">vw_fines_summary</code> que
              agrupa las multas por mes y calcula totales de pagos pendientes y realizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}