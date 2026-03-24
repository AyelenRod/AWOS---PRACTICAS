import { getInventoryHealth } from "@/app/actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const inventory = await getInventoryHealth();
  const totalCopies = inventory.reduce((acc, c) => acc + Number(c.total_copies), 0);
  const totalAvailable = inventory.reduce((acc, c) => acc + Number(c.count_available), 0);
  const totalBorrowed = inventory.reduce((acc, c) => acc + Number(c.count_loaned), 0);
  const totalLost = inventory.reduce((acc, c) => acc + Number(c.count_lost), 0);
  const overallAvailability = totalCopies > 0 ? (totalAvailable / totalCopies) * 100 : 0;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[#2E5AA7] font-bold hover:underline">
        ← Volver al Dashboard
      </Link>

      {/* Encabezado*/}
      <div className="rounded-2xl p-6 bg-[#2E5AA7] text-white">
        <h1 className="text-2xl font-bold">Inventario General</h1>
        <p className="text-white/80 text-sm mb-6">Estado del catálogo por categoría</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-70">Total Copias</span>
            <p className="text-xl font-bold">{totalCopies}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-70">Disponibles</span>
            <p className="text-xl font-bold">{totalAvailable}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-70">Disponibilidad</span>
            <p className="text-xl font-bold">{overallAvailability.toFixed(1)}%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg border border-white/20">
            <span className="text-[10px] uppercase font-bold opacity-70">Vista SQL</span>
            <p className="text-sm font-bold truncate">inventory_health</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-l-4 border-slate-400 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-800">{totalCopies}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase">Disponible</p>
          <p className="text-2xl font-bold text-slate-800">{totalAvailable}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-[#FFA62B] shadow-sm">
          <p className="text-xs font-bold text-[#FFA62B] uppercase">Prestado</p>
          <p className="text-2xl font-bold text-slate-800">{totalBorrowed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
          <p className="text-xs font-bold text-red-600 uppercase">Perdido</p>
          <p className="text-2xl font-bold text-slate-800">{totalLost}</p>
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Detalle por Categoría</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
                <th className="px-5 py-4 text-left">Categoría</th>
                <th className="px-5 py-4 text-right">Total</th>
                <th className="px-5 py-4 text-right">Disp.</th>
                <th className="px-5 py-4 text-right">Prest.</th>
                <th className="px-5 py-4 text-right">Perd.</th>
                <th className="px-5 py-4 text-center">Salud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((cat) => {
                const avail = Number(cat.availability_percentage);
                let color = 'bg-emerald-500';
                let label = 'BUENO';
                if (avail < 30) { color = 'bg-red-500'; label = 'CRÍTICO'; }
                else if (avail < 60) { color = 'bg-[#FFA62B]'; label = 'BAJO'; }

                return (
                  <tr key={cat.category} className="text-slate-700">
                    <td className="px-5 py-4 font-bold">{cat.category}</td>
                    <td className="px-5 py-4 text-right">{cat.total_copies}</td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-bold">{cat.count_available}</td>
                    <td className="px-5 py-4 text-right text-[#FFA62B] font-bold">{cat.count_borrowed}</td>
                    <td className="px-5 py-4 text-right text-red-500 font-bold">{cat.count_lost}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold">{label}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color}`} style={{ width: `${avail}%` }} />
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

      {/* Pie de página*/}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-[10px] text-slate-500 font-bold uppercase">
          Fuente: <span className="text-[#2E5AA7]">vw_inventory_health</span>
        </p>
      </div>
    </div>
  );
}