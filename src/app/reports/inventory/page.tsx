import { getInventoryHealth } from "@/app/actions";
import { Package, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const inventory = await getInventoryHealth();

  const totalCopies = inventory.reduce((acc, cat) => acc + Number(cat.total_copies), 0);
  const totalAvailable = inventory.reduce((acc, cat) => acc + Number(cat.count_available), 0);
  const totalBorrowed = inventory.reduce((acc, cat) => acc + Number(cat.count_borrowed), 0);
  const globalAvailability = totalCopies > 0 ? (totalAvailable / totalCopies) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Package className="w-10 h-10 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Inventario General por Categoría</h1>
              <p className="text-white/90 text-lg">Estado de disponibilidad de colección bibliotecaria</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Vista SQL</span>
              </div>
              <p className="text-xl font-bold">vw_inventory_health</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Total Copias</span>
              </div>
              <p className="text-2xl font-bold">{totalCopies}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Disponibles</span>
              </div>
              <p className="text-2xl font-bold">{totalAvailable}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-300" />
                <span className="text-sm text-white/70 uppercase tracking-wide">Disponibilidad</span>
              </div>
              <p className="text-2xl font-bold">{globalAvailability.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border-l-4 border-emerald-500 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">DISPONIBLE</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalAvailable}</div>
          <div className="text-sm text-slate-500">Copias listas para préstamo</div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${globalAvailability}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-[#2E5AA7] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#2E5AA7]/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-[#2E5AA7]" />
            </div>
            <span className="text-xs font-bold text-[#2E5AA7] bg-[#2E5AA7]/10 px-3 py-1 rounded-full">EN USO</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalBorrowed}</div>
          <div className="text-sm text-slate-500">Copias actualmente prestadas</div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] rounded-full transition-all duration-500"
              style={{ width: `${100 - globalAvailability}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-l-4 border-[#FFA62B] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-[#FFA62B]/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-[#FFA62B]" />
            </div>
            <span className="text-xs font-bold text-[#FFA62B] bg-[#FFA62B]/10 px-3 py-1 rounded-full">CATEGORÍAS</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{inventory.length}</div>
          <div className="text-sm text-slate-500">Distintas categorías</div>
          <div className="mt-4 text-xs text-slate-400">Total de clasificaciones</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-200/50 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-2xl font-bold text-slate-900">Detalle por Categoría</h2>
          <p className="text-slate-600 mt-2">Estado de inventario y disponibilidad por categoría de libro</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Categoría</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Total Copias</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Disponibles</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Prestadas</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Disponibilidad %</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((cat) => {
                const availability = Number(cat.availability_percentage);
                let statusColor = 'from-emerald-500 to-emerald-600';
                let statusText = 'Óptimo';
                let statusBg = 'bg-emerald-50';
                let statusTextColor = 'text-emerald-700';
                let barColor = 'from-emerald-500 to-emerald-600';
                
                if (availability < 20) {
                  statusColor = 'from-red-500 to-red-600';
                  statusText = 'Crítico';
                  statusBg = 'bg-red-50';
                  statusTextColor = 'text-red-700';
                  barColor = 'from-red-500 to-red-600';
                } else if (availability < 40) {
                  statusColor = 'from-orange-500 to-orange-600';
                  statusText = 'Bajo';
                  statusBg = 'bg-orange-50';
                  statusTextColor = 'text-orange-700';
                  barColor = 'from-orange-500 to-orange-600';
                } else if (availability < 60) {
                  statusColor = 'from-yellow-400 to-yellow-500';
                  statusText = 'Moderado';
                  statusBg = 'bg-yellow-50';
                  statusTextColor = 'text-yellow-700';
                  barColor = 'from-yellow-400 to-yellow-500';
                }

                return (
                  <tr key={cat.category} className={`hover:${statusBg} transition-all duration-200 group`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 bg-gradient-to-br ${statusColor} rounded-xl shadow-lg`}>
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{cat.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-2xl font-bold text-slate-900">{cat.total_copies}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                        {cat.count_available}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] text-white shadow-lg">
                        {cat.count_borrowed}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold ${statusTextColor}`}>{availability.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500 shadow-sm`}
                            style={{ width: `${availability}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${statusColor} text-white shadow-lg`}>
                          {availability < 20 && <AlertTriangle className="w-4 h-4" />}
                          {availability >= 60 && <CheckCircle className="w-4 h-4" />}
                          {statusText}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-2">Sobre este Reporte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Este reporte consulta la vista <code className="px-2 py-1 bg-white rounded font-mono text-xs text-indigo-600 border border-indigo-200">vw_inventory_health</code> que 
              agrupa las copias por categoría de libro y calcula: COUNT(*) AS total_copies, SUM(IF(status='available', 1, 0)) AS count_available, 
              SUM(IF(status='borrowed', 1, 0)) AS count_borrowed, y (count_available / total_copies * 100) AS availability_percentage. 
              Útil para identificar categorías con baja disponibilidad que requieran adquisición de nuevas copias.
            </p>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border-l-4 border-red-500 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold text-slate-700">Crítico</span>
          </div>
          <div className="text-xs text-slate-500">&lt; 20% disponibilidad</div>
          <div className="mt-2 text-xs font-semibold text-red-600">Requiere atención inmediata</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-orange-500 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-slate-700">Bajo</span>
          </div>
          <div className="text-xs text-slate-500">20-39% disponibilidad</div>
          <div className="mt-2 text-xs font-semibold text-orange-600">Considerar nuevas copias</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-yellow-400 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold text-slate-700">Moderado</span>
          </div>
          <div className="text-xs text-slate-500">40-59% disponibilidad</div>
          <div className="mt-2 text-xs font-semibold text-yellow-600">Monitorear demanda</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-500 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Óptimo</span>
          </div>
          <div className="text-xs text-slate-500">≥ 60% disponibilidad</div>
          <div className="mt-2 text-xs font-semibold text-emerald-600">Estado saludable</div>
        </div>
      </div>
    </div>
  );
}