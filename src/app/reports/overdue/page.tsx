import { getOverdueLoans } from "@/app/actions";
import { Clock, AlertTriangle, Calendar, Users } from 'lucide-react';
import Pagination from "@/components/Pagination";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function OverduePage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getOverdueLoans(currentPage);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-700 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <AlertTriangle className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Préstamos Vencidos</h1>
              <p className="text-white/90 text-lg">Monitoreo de devoluciones pendientes fuera de plazo</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-2xl font-bold">vw_overdue_loans</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Préstamos Vencidos</span>
              </div>
              <p className="text-2xl font-bold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Página Actual</span>
              </div>
              <p className="text-2xl font-bold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Tabla de Resultados</h2>
              <p className="text-slate-600 mt-2">Préstamos con fecha de retorno vencida sin devolución registrada</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 uppercase tracking-wide">Total Vencidos</div>
              <div className="text-3xl font-bold text-red-600">{result.totalRecords}</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID Préstamo</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Socio</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Libro</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha Préstamo</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha Límite</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Días Vencido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((loan) => {
                const daysOverdue = Number(loan.days_overdue);
                let severityColor = 'from-yellow-400 to-yellow-500';
                let bgColor = 'bg-yellow-50';
                let textColor = 'text-yellow-700';
                
                if (daysOverdue > 30) {
                  severityColor = 'from-red-500 to-red-600';
                  bgColor = 'bg-red-50';
                  textColor = 'text-red-700';
                } else if (daysOverdue > 14) {
                  severityColor = 'from-orange-400 to-orange-500';
                  bgColor = 'bg-orange-50';
                  textColor = 'text-orange-700';
                }

                return (
                  <tr key={loan.loan_id} className={`hover:${bgColor} transition-all duration-200 group`}>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm font-semibold text-slate-700">{loan.loan_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#2E5AA7] to-[#86C5FF] rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900">{loan.member_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-600">{loan.member_email}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-medium text-slate-900">{loan.book_title}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {new Date(loan.loan_date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-600">
                          {new Date(loan.return_date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${severityColor} text-white shadow-lg min-w-[5rem]`}>
                          {daysOverdue} días
                        </span>
                        {daysOverdue > 30 && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">URGENTE</span>
                        )}
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

      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">Sobre este Reporte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Este reporte consulta la vista <code className="px-2 py-1 bg-white rounded font-mono text-xs text-red-600 border border-red-200">vw_overdue_loans</code> que 
              identifica préstamos activos (return_actual IS NULL) cuya fecha de retorno programada (return_date) ya pasó. 
              Se calcula automáticamente los días de retraso mediante DATEDIFF(CURDATE(), return_date). Los resultados están 
              ordenados por antigüedad del vencimiento (mayor a menor).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-l-4 border-yellow-400 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Retraso Leve</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {result.data.filter(l => Number(l.days_overdue) <= 14).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">1-14 días</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-orange-400 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Retraso Moderado</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {result.data.filter(l => Number(l.days_overdue) > 14 && Number(l.days_overdue) <= 30).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">15-30 días</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Retraso Crítico</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {result.data.filter(l => Number(l.days_overdue) > 30).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">+30 días</div>
        </div>
      </div>
    </div>
  );
}