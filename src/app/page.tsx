import Link from 'next/link';
import {
  BookOpen, AlertTriangle, DollarSign, Users, Package, ArrowRight
} from 'lucide-react';

const reports = [
  {
    title: "Libros Más Prestados",
    desc: "Ranking de popularidad basado en historial de préstamos.",
    href: "/reports/most-borrowed",
    icon: BookOpen,
    bg: "#FFA62B",
    light: "#FFF8ED",
    text: "#FFA62B",
  },
  {
    title: "Préstamos Vencidos",
    desc: "Devoluciones pendientes fuera de plazo y alertas de urgencia.",
    href: "/reports/overdue",
    icon: AlertTriangle,
    bg: "#EF4444",
    light: "#FEF2F2",
    text: "#EF4444",
  },
  {
    title: "Resumen de Multas",
    desc: "Penalizaciones, pagos realizados y montos pendientes.",
    href: "/reports/fines",
    icon: DollarSign,
    bg: "#2E5AA7",
    light: "#E3F2FD",
    text: "#2E5AA7",
  },
  {
    title: "Actividad de Socios",
    desc: "Participación, niveles de lectura y uso del sistema.",
    href: "/reports/activity",
    icon: Users,
    bg: "#86C5FF",
    light: "#EFF8FF",
    text: "#2E5AA7",
  },
  {
    title: "Inventario General",
    desc: "Estado del catálogo: disponibles, prestados y perdidos.",
    href: "/reports/inventory",
    icon: Package,
    bg: "#F8E6A0",
    light: "#FFFDF0",
    text: "#B8860B",
  },
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E5AA7]">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Selecciona un reporte para ver la información detallada</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col justify-between bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: r.bg }}
                  >
                    <Icon className="text-white" size={22} />
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: r.light }}
                  >
                    <ArrowRight size={14} style={{ color: r.text }} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50">
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: r.light, color: r.text }}
                >
                  Ver reporte →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}