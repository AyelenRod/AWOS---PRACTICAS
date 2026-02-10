import { getOverdueLoans } from "@/app/actions";
import { Clock, AlertTriangle, Calendar, Users } from 'lucide-react';
import Pagination from "@/components/Pagination";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function OverduePage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getOverdueLoans(currentPage);

  const leve = result.data.filter(l => Number(l.days_overdue) <= 14).length;
  const moderado = result.data.filter(l => Number(l.days_overdue) > 14 && Number(l.days_overdue) <= 30).length;
  const critico = result.data.filter(l => Number(l.days_overdue) > 30).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      {/* Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Préstamos Vencidos</h1>
              <p className="text-white/80 text-sm">Monitoreo de devoluciones pendientes fuera de plazo</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-base font-semibold">vw_overdue_loans</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Total Vencidos</span>
              </div>
              <p className="text-lg font-semibold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60 uppercase tracking-wide">Página</span>
              </div>
              <p className="text-lg font-semibold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Severity cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#FFA62B] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#FFA62B] rounded-full"></div>
            <span className="text-xs font-semibold text-slate-600 uppercase">Retraso Leve</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{leve}</div>
          <div className="text-xs text-slate-500">1-14 días</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-xs font-semibold text-slate-600 uppercase">Retraso Moderado</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{moderado}</div>
          <div className="text-xs text-slate-500">15-30 días</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#EF4444] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse-soft"></div>
            <span className="text-xs font-semibold text-slate-600 uppercase">Retraso Crítico</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{critico}</div>
          <div className="text-xs text-slate-500">+30 días</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Tabla de Resultados</h2>
            <p className="text-sm text-slate-500">Préstamos con fecha de retorno vencida</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase">Total Vencidos</div>
            <div className="text-2xl font-bold text-[#EF4444]">{result.totalRecords}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Socio</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Libro</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha Préstamo</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha Límite</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Días Vencido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {result.data.map((loan) => {
                const daysOverdue = Number(loan.days_overdue);
                let severityColor = 'bg-[#FFA62B]';
                if (daysOverdue > 30) severityColor = 'bg-[#EF4444]';
                else if (daysOverdue > 14) severityColor = 'bg-orange-500';

                return (
                  <tr key={loan.loan_id} className="table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-700">{loan.loan_id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#2E5AA7] rounded-lg">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-800 text-sm">{loan.member_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800 text-sm">{loan.book_title}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(loan.loan_date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#EF4444]">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(loan.return_date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold ${severityColor} text-white`}>
                          {daysOverdue} días
                        </span>
                        {daysOverdue > 30 && (
                          <span className="px-2 py-0.5 bg-red-100 text-[#EF4444] text-[10px] font-bold rounded-full">URGENTE</span>
                        )}
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
      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#EF4444] rounded-lg">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Sobre este Reporte</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulta la vista <code className="px-1.5 py-0.5 bg-white rounded font-mono text-xs text-[#EF4444] border">vw_overdue_loans</code> que
              identifica préstamos activos cuya fecha de retorno ya pasó.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}