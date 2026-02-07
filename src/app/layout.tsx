import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Clock, AlertCircle, Users, Package, Library } from "lucide-react";

export const metadata: Metadata = {
  title: "Library Analytics Dashboard",
  description: "Sistema avanzado de reportes SQL para bibliotecas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen">
        <aside className="w-80 bg-gradient-to-br from-[#2E5AA7] via-[#2E5AA7] to-[#1e3a5f] text-white flex-shrink-0 hidden md:flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#86C5FF] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFA62B] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="p-8 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
                <Library className="w-8 h-8 text-[#FFA62B]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Biblioteca</h1>
                <p className="text-sm text-white/70">Sistema de Reportes</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 relative z-10">
            <NavItem href="/" icon={<LayoutDashboard size={22} />} label="Dashboard Principal" />
            
            <div className="pt-8 pb-3 px-3">
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider">Reportes Analíticos</div>
              <div className="mt-2 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            
            <NavItem href="/reports/most-borrowed" icon={<BookOpen size={22} />} label="Libros Populares" />
            <NavItem href="/reports/overdue" icon={<Clock size={22} />} label="Préstamos Vencidos" />
            <NavItem href="/reports/fines" icon={<AlertCircle size={22} />} label="Resumen de Multas" />
            <NavItem href="/reports/activity" icon={<Users size={22} />} label="Actividad de Socios" />
            <NavItem href="/reports/inventory" icon={<Package size={22} />} label="Inventario General" />
          </nav>

          <div className="p-6 border-t border-white/10 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-[#FFA62B] rounded-full animate-pulse shadow-lg shadow-[#FFA62B]/50" />
                <span className="text-sm font-semibold text-white">Sistema Activo</span>
              </div>
              <div className="text-xs text-[#F8E6A0] font-mono">usuario: app_user</div>
              <div className="mt-3 text-xs text-white/60">Permisos de solo lectura en vistas</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-10 py-6 shadow-sm relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] bg-clip-text text-transparent">
                  Sistema de Gestión Bibliotecaria
                </h2>
                <p className="text-sm text-slate-500 mt-1">Consultas optimizadas con vistas SQL indexadas</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Fecha Actual</div>
                  <div className="text-sm font-bold text-[#2E5AA7] mt-0.5">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 text-sm font-medium rounded-2xl hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 group backdrop-blur-sm border border-transparent hover:border-white/20"
    >
      <span className="group-hover:scale-110 transition-transform duration-300 text-[#FFA62B]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}