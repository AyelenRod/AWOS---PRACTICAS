import { getMemberActivity } from "@/app/actions";
import { Users, BookOpen, Calendar, Award } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#86C5FF] to-[#5BA8F5] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Actividad de Socios</h1>
              <p className="text-white/80 text-sm">Estadísticas de participación y uso del sistema</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Vista SQL</span>
              <p className="text-base font-semibold mt-1">vw_member_activity</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Total Socios</span>
              <p className="text-lg font-semibold mt-1">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Página</span>
              <p className="text-lg font-semibold mt-1">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Tabla de Resultados</h2>
          <p className="text-sm text-slate-500">Ordenados por total de préstamos</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">#</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Nombre</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Tipo</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Total</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Vencidos</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Tasa Puntual</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {result.data.map((m, i) => {
                const rank = (currentPage - 1) * 10 + i + 1;
                const total = Number(m.total_loans);
                const overdue = Number(m.active_overdue_count);
                const rate = Number(m.on_time_return_rate);
                let rankBg = 'bg-slate-400';
                if (rank === 1) rankBg = 'bg-[#FFA62B]';
                else if (rank <= 3) rankBg = 'bg-[#86C5FF]';
                let level = 'Lector', lvlBg = 'bg-slate-400';
                if (total >= 30) { level = 'Avanzado'; lvlBg = 'bg-[#2E5AA7]'; }
                else if (total >= 15) { level = 'Frecuente'; lvlBg = 'bg-[#FFA62B]'; }
                else if (total >= 5) { level = 'Activo'; lvlBg = 'bg-emerald-500'; }
                return (
                  <tr key={m.member_id} className="table-row-hover transition-colors">
                    <td className="px-5 py-4"><div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${rankBg} text-white text-sm font-bold`}>{rank}</div></td>
                    <td className="px-5 py-4 font-medium text-slate-800 text-sm">{m.name}</td>
                    <td className="px-5 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-[#E3F2FD] text-[#2E5AA7]">{m.member_type}</span></td>
                    <td className="px-5 py-4"><span className="text-lg font-bold text-[#2E5AA7]">{total}</span></td>
                    <td className="px-5 py-4"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${overdue > 0 ? 'bg-[#EF4444] text-white' : 'bg-slate-100 text-slate-500'}`}>{overdue}</span></td>
                    <td className="px-5 py-4"><span className={`text-sm font-semibold ${rate >= 80 ? 'text-emerald-600' : rate >= 50 ? 'text-[#FFA62B]' : 'text-[#EF4444]'}`}>{rate.toFixed(1)}%</span></td>
                    <td className="px-5 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold ${lvlBg} text-white`}>{level}</span></td>
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

      <div className="bg-[#EFF8FF] rounded-xl p-4 border border-[#86C5FF]/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#86C5FF] rounded-lg"><Users className="w-4 h-4 text-white" /></div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Sobre este Reporte</h3>
            <p className="text-xs text-slate-600">Consulta la vista <code className="px-1.5 py-0.5 bg-white rounded font-mono text-xs text-[#2E5AA7] border">vw_member_activity</code> que agrupa préstamos por socio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}