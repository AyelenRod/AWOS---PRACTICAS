import { getInventoryHealth } from "@/app/actions";
import { Package, BookOpen, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const inventory = await getInventoryHealth();
  const totalCopies = inventory.reduce((acc, c) => acc + Number(c.total_copies), 0);
  const totalAvailable = inventory.reduce((acc, c) => acc + Number(c.count_available), 0);
  const totalBorrowed = inventory.reduce((acc, c) => acc + Number(c.count_borrowed), 0);
  const totalLost = inventory.reduce((acc, c) => acc + Number(c.count_lost), 0);
  const overallAvailability = totalCopies > 0 ? (totalAvailable / totalCopies) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2E5AA7] hover:underline font-medium">
        ← Volver al Dashboard
      </Link>

      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#2E5AA7] to-[#1a3d7a] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8E6A0]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/15 backdrop-blur-sm rounded-xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Inventario General</h1>
              <p className="text-white/80 text-sm">Estado del catálogo bibliotecario por categoría</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Vista SQL</span>
              <p className="text-base font-semibold mt-1">vw_inventory_health</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Total Copias</span>
              <p className="text-lg font-semibold mt-1">{totalCopies}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Disponibles</span>
              <p className="text-lg font-semibold mt-1">{totalAvailable}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <span className="text-xs text-white/60 uppercase tracking-wide">Disponibilidad</span>
              <p className="text-lg font-semibold mt-1">{overallAvailability.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border-l-4 border-slate-500 shadow-sm">
          <div className="p-2 bg-slate-100 rounded-lg w-fit mb-2"><Package className="w-5 h-5 text-slate-600" /></div>
          <div className="text-2xl font-bold text-slate-800">{totalCopies}</div>
          <div className="text-xs text-slate-500">Total en catálogo</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-emerald-500 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">DISPONIBLE</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalAvailable}</div>
          <div className="text-xs text-slate-500">Listos para préstamo</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#FFA62B] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-[#FFF8ED] rounded-lg"><AlertTriangle className="w-5 h-5 text-[#FFA62B]" /></div>
            <span className="text-[10px] font-bold text-[#FFA62B] bg-[#FFF8ED] px-2 py-0.5 rounded-full">PRESTADO</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalBorrowed}</div>
          <div className="text-xs text-slate-500">En circulación</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-l-4 border-[#EF4444] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg"><XCircle className="w-5 h-5 text-[#EF4444]" /></div>
            <span className="text-[10px] font-bold text-[#EF4444] bg-red-50 px-2 py-0.5 rounded-full">PERDIDO</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{totalLost}</div>
          <div className="text-xs text-slate-500">Bajas del sistema</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Detalle por Categoría</h2>
          <p className="text-sm text-slate-500">Ordenados por porcentaje de disponibilidad</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Categoría</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Total</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Disponibles</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Prestados</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-slate-600 uppercase">Perdidos</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Disponibilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map((cat) => {
                const avail = Number(cat.availability_percentage);
                let barColor = 'bg-emerald-500', statusText = 'BUENO', statusCls = 'text-emerald-600 bg-emerald-50';
                if (avail < 30) { barColor = 'bg-[#EF4444]'; statusText = 'CRÍTICO'; statusCls = 'text-[#EF4444] bg-red-50'; }
                else if (avail < 60) { barColor = 'bg-[#FFA62B]'; statusText = 'BAJO'; statusCls = 'text-[#FFA62B] bg-[#FFF8ED]'; }
                return (
                  <tr key={cat.category} className="table-row-hover transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#2E5AA7] rounded-lg"><BookOpen className="w-4 h-4 text-white" /></div>
                        <span className="font-medium text-slate-800 text-sm">{cat.category}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">{cat.total_copies}</td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-semibold">{cat.count_available}</td>
                    <td className="px-5 py-4 text-right text-[#FFA62B] font-semibold">{cat.count_borrowed}</td>
                    <td className="px-5 py-4 text-right text-[#EF4444] font-semibold">{cat.count_lost}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-[120px] overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${avail}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 min-w-[3rem] text-right">{avail.toFixed(0)}%</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>{statusText}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#FFFDF0] rounded-xl p-4 border border-[#F8E6A0]">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#FFA62B] rounded-lg"><Package className="w-4 h-4 text-white" /></div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">Sobre este Reporte</h3>
            <p className="text-xs text-slate-600">Consulta la vista <code className="px-1.5 py-0.5 bg-white rounded font-mono text-xs text-[#FFA62B] border">vw_inventory_health</code> que agrupa copias por categoría.</p>
          </div>
        </div>
      </div>
    </div>
  );
}