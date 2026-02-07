import { getMemberActivity } from "@/app/actions";
import { Users, TrendingUp, BookOpen, Calendar, Award } from 'lucide-react';
import Pagination from "@/components/Pagination";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function ActivityPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getMemberActivity(currentPage);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#2E5AA7] via-[#2E5AA7] to-[#1e3a5f] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#86C5FF] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA62B] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Users className="w-10 h-10 text-[#FFA62B]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Actividad de Socios</h1>
              <p className="text-white/90 text-lg">Estadísticas de participación y uso del sistema bibliotecario</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-2xl font-bold">vw_member_activity</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Total Socios</span>
              </div>
              <p className="text-2xl font-bold">{result.totalRecords}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-[#F8E6A0]" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Página Actual</span>
              </div>
              <p className="text-2xl font-bold">{currentPage} de {result.totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-[#2E5AA7]/5 to-[#86C5FF]/5">
          <h2 className="text-2xl font-bold text-slate-900">Tabla de Resultados</h2>
          <p className="text-slate-600 mt-2">Ordenados por número total de préstamos históricos (mayor a menor)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Ranking</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">ID Socio</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nombre</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total Préstamos</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Activos</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Completados</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((member, index) => {
                const globalRank = (currentPage - 1) * 10 + index + 1;
                const totalLoans = Number(member.total_loans);
                const activeLoans = Number(member.active_loans);
                const completedLoans = Number(member.completed_loans);
                
                let rankColor = 'from-slate-400 to-slate-500';
                let level = 'Lector';
                let levelColor = 'from-slate-400 to-slate-500';
                
                if (globalRank === 1) rankColor = 'from-yellow-400 to-yellow-500';
                else if (globalRank === 2) rankColor = 'from-slate-300 to-slate-400';
                else if (globalRank === 3) rankColor = 'from-amber-600 to-amber-700';
                else if (globalRank <= 10) rankColor = 'from-[#2E5AA7] to-[#86C5FF]';

                if (totalLoans >= 50) {
                  level = 'Bibliófilo Élite';
                  levelColor = 'from-purple-500 to-purple-600';
                } else if (totalLoans >= 30) {
                  level = 'Lector Avanzado';
                  levelColor = 'from-[#2E5AA7] to-[#86C5FF]';
                } else if (totalLoans >= 15) {
                  level = 'Lector Frecuente';
                  levelColor = 'from-[#FFA62B] to-[#F8E6A0]';
                } else if (totalLoans >= 5) {
                  level = 'Lector Activo';
                  levelColor = 'from-emerald-500 to-emerald-600';
                }

                return (
                  <tr key={member.member_id} className="hover:bg-gradient-to-r hover:from-[#2E5AA7]/5 hover:to-[#86C5FF]/5 transition-all duration-200 group">
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${rankColor} text-white font-bold shadow-lg`}>
                        #{globalRank}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-sm font-semibold text-slate-700">{member.member_id}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#2E5AA7] to-[#86C5FF] rounded-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-[#2E5AA7] transition-colors">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-600">{member.email}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[120px] overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((totalLoans / 50) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xl font-bold text-[#2E5AA7] min-w-[3rem] text-right">{totalLoans}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold ${
                        activeLoans > 0 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {activeLoans}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700">
                        {completedLoans}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#FFA62B]" />
                        <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${levelColor} text-white shadow-lg`}>
                          {level}
                        </span>
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

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-[#2E5AA7]/10 to-[#86C5FF]/10 rounded-2xl p-6 border border-[#2E5AA7]/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#2E5AA7] rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">Sobre este Reporte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Este reporte consulta la vista <code className="px-2 py-1 bg-white rounded font-mono text-xs text-[#2E5AA7] border border-[#2E5AA7]/20">vw_member_activity</code> que 
              agrupa préstamos por socio calculando: COUNT(*) AS total_loans, SUM(IF(return_actual IS NULL, 1, 0)) AS active_loans, 
              y SUM(IF(return_actual IS NOT NULL, 1, 0)) AS completed_loans. Los resultados están ordenados por total_loans DESC 
              para identificar a los socios más activos del sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Level Guide */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border-l-4 border-slate-400 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Lector</span>
          </div>
          <div className="text-xs text-slate-500">1-4 préstamos</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-500 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Lector Activo</span>
          </div>
          <div className="text-xs text-slate-500">5-14 préstamos</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#FFA62B] shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#FFA62B]" />
            <span className="text-sm font-bold text-slate-700">Lector Frecuente</span>
          </div>
          <div className="text-xs text-slate-500">15-29 préstamos</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-[#2E5AA7] shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#2E5AA7]" />
            <span className="text-sm font-bold text-slate-700">Lector Avanzado</span>
          </div>
          <div className="text-xs text-slate-500">30-49 préstamos</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Award className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Nivel Élite: Bibliófilo Élite</h3>
            <p className="text-white/90">50+ préstamos - Los lectores más dedicados de la biblioteca</p>
          </div>
        </div>
      </div>
    </div>
  );
}