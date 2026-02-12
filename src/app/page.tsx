import Link from 'next/link';

const reports = [
  {
    title: "Libros Más Prestados",
    desc: "Ranking de popularidad basado en historial de préstamos.",
    href: "/reports/most-borrowed",
    bg: "#FFA62B",
    light: "#FFF8ED",
    text: "#FFA62B",
  },
  {
    title: "Préstamos Vencidos",
    desc: "Devoluciones pendientes fuera de plazo y alertas de urgencia.",
    href: "/reports/overdue",
    bg: "#EF4444",
    light: "#FEF2F2",
    text: "#EF4444",
  },
  {
    title: "Resumen de Multas",
    desc: "Penalizaciones, pagos realizados y montos pendientes.",
    href: "/reports/fines",
    bg: "#2E5AA7",
    light: "#E3F2FD",
    text: "#2E5AA7",
  },
  {
    title: "Actividad de Socios",
    desc: "Participación, niveles de lectura y uso del sistema.",
    href: "/reports/activity",
    bg: "#86C5FF",
    light: "#EFF8FF",
    text: "#2E5AA7",
  },
  {
    title: "Inventario General",
    desc: "Estado del catálogo: disponibles, prestados y perdidos.",
    href: "/reports/inventory",
    bg: "#F8E6A0",
    light: "#FFFDF0",
    text: "#B8860B",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E5AA7]">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Selecciona un reporte para ver la información detallada</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => {
          return (
            <Link
              key={r.href}
              href={r.href}
              className="flex flex-col justify-between bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div>
                <div 
                  className="w-8 h-1 mb-4 rounded-full" 
                  style={{ backgroundColor: r.bg }}
                />
                
                <h3 className="font-bold text-slate-800 text-base mb-2">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-50">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: r.text }}
                >
                  Abrir Reporte
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}