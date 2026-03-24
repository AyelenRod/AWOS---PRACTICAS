import { getMemberActivity } from "@/app/actions";
import Pagination from "@/components/Pagination";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function ActivityPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getMemberActivity(currentPage);

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      {/* Header*/}
      <div className="rounded-2xl p-6 bg-[#86C5FF] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Actividad de Socios</h1>
            <p className="text-white/90 text-sm mt-1">Estadísticas de participación y uso del sistema</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold">Total Socios</span>
              <p className="text-xl font-bold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 border border-white/10">
              <span className="text-[10px] text-white/70 uppercase block font-bold">Página</span>
              <p className="text-xl font-bold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Tabla de Resultados</h2>
          <p className="text-xs text-slate-500">Ordenados por total de préstamos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">#</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vencidos</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasa Puntual</th>
                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((m, i) => {
                const rank = (currentPage - 1) * 10 + i + 1;
                const total = Number(m.total_loans);
                const overdue = Number(m.active_overdue_count);
                const rate = Number(m.on_time_return_rate);
                
                let rankColor = 'bg-slate-100 text-slate-500';
                if (rank === 1) rankColor = 'bg-[#FFA62B] text-white';
                else if (rank <= 3) rankColor = 'bg-[#86C5FF] text-white';

                let level = 'Lector', lvlBg = 'bg-slate-100 text-slate-500';
                if (total >= 30) { level = 'Avanzado'; lvlBg = 'bg-[#2E5AA7] text-white'; }
                else if (total >= 15) { level = 'Frecuente'; lvlBg = 'bg-[#FFA62B] text-white'; }
                else if (total >= 5) { level = 'Activo'; lvlBg = 'bg-emerald-500 text-white'; }

                return (
                  <tr key={m.member_id}>
                    <td className="px-5 py-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${rankColor}`}>
                        {rank}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{m.name}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {m.member_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-base font-bold text-[#2E5AA7]">{total}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${overdue > 0 ? 'bg-red-100 text-red-600' : 'text-slate-400'}`}>
                        {overdue}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm">
                      {rate.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${lvlBg}`}>
                        {level}
                      </span>
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

      {/* Pie de Pagina */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white">
        <p className="text-xs text-slate-400 font-medium">
          Fuente de datos: <code className="text-[#2E5AA7] font-bold">vw_member_activity</code>
        </p>
      </div>
    </div>
  );
}