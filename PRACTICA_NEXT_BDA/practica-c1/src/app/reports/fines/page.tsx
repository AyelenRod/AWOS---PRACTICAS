import { getFinesSummary } from "@/app/actions";
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
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      {/* Banner*/}
      <div className="rounded-2xl p-6 bg-[#FFA62B] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">Resumen de Multas</h1>
            <p className="text-white/90 text-sm mt-1">Estado financiero de penalizaciones y cobros</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold mb-1">Total Generado</span>
              <p className="text-lg font-bold">${totalFines.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold mb-1">Pendiente</span>
              <p className="text-lg font-bold">${totalPending.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold mb-1">Tasa Cobro</span>
              <p className="text-lg font-bold">{collectionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold mb-1">Registros</span>
              <p className="text-lg font-bold">{result.totalRecords}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">PAGADO</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">${totalPaid.toFixed(2)}</div>
          <p className="text-xs text-slate-400 mt-1">Total recaudado con éxito</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">PENDIENTE</span>
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">${totalPending.toFixed(2)}</div>
          <p className="text-xs text-slate-400 mt-1">Monto que aún debe ingresarse</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-[#2E5AA7] bg-[#E3F2FD] px-2 py-1 rounded">SOCIOS</span>
            <div className="w-2 h-2 rounded-full bg-[#2E5AA7]"></div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{result.totalRecords}</div>
          <p className="text-xs text-slate-400 mt-1">Personas con multas activas</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Detalle por Período</h2>
          <p className="text-xs text-slate-500">Reporte mensual de cobranza</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mes</th>
                <th className="px-5 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cant.</th>
                <th className="px-5 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generado</th>
                <th className="px-5 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pagado</th>
                <th className="px-5 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendiente</th>
                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {result.data.map((fine) => {
                const pending = Number(fine.total_pending);
                const paid = Number(fine.total_paid);
                const total = pending + paid;
                const paymentRate = total > 0 ? (paid / total) * 100 : 0;

                return (
                  <tr key={fine.month_str} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-700">{fine.month_str}</td>
                    <td className="px-5 py-4 text-right text-slate-500">{fine.total_fines_count}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800">${total.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-medium">${paid.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right text-red-600 font-medium">${pending.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        {pending === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white">SALDADO</span>
                        ) : paymentRate >= 50 ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FFA62B] text-white">PARCIAL</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white">PENDIENTE</span>
                        )}
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${paymentRate}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/*Pie de página*/}
      <div className="p-4 rounded-xl border border-slate-200 bg-white">
        <p className="text-[10px] text-slate-400 font-medium">
          SQL VIEW: <span className="text-[#FFA62B] font-bold ml-1">vw_fines_summary</span>
        </p>
      </div>
    </div>
  );
}