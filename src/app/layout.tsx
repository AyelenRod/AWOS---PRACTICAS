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
      <body className="flex min-h-screen bg-slate-50">
        <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex-shrink-0 hidden md:flex flex-col shadow-xl">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Biblioteca</h1>
                <p className="text-xs text-slate-400">Sistema de Reportes</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            
            <div className="pt-6 pb-2 px-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reportes SQL</div>
              <div className="mt-1 h-px bg-slate-700" />
            </div>
            
            <NavItem href="/reports/most-borrowed" icon={<BookOpen size={20} />} label="Más Prestados" />
            <NavItem href="/reports/overdue" icon={<Clock size={20} />} label="Préstamos Vencidos" />
            <NavItem href="/reports/fines" icon={<AlertCircle size={20} />} label="Multas" />
            <NavItem href="/reports/activity" icon={<Users size={20} />} label="Actividad Socios" />
            <NavItem href="/reports/inventory" icon={<Package size={20} />} label="Inventario" />
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">Usuario Conectado</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono">app_user</div>
              <div className="mt-2 text-xs text-slate-400">Permisos: SOLO LECTURA</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-500">Sistema de Gestión Bibliotecaria</h2>
                <p className="text-xs text-slate-400 mt-0.5">Consultas optimizadas con vistas SQL</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Fecha actual</div>
                  <div className="text-sm font-semibold text-slate-900">
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

          <div className="flex-1 overflow-y-auto p-8">
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
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-200 group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </Link>
  );
}