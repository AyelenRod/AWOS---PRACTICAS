import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Clock, AlertCircle, Users, Boxes } from "lucide-react";

export const metadata: Metadata = {
  title: "Library Analytics",
  description: "Advanced SQL Reporting Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-slate-100 flex-shrink-0 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white">
              Biblioteca
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Inicio" />
            <div className="pt-4 pb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reportes</div>
            <NavItem href="/reports/most-borrowed" icon={<BookOpen size={20} />} label="Más Prestados" />
            <NavItem href="/reports/overdue" icon={<Clock size={20} />} label="Préstamos Vencidos" />
            <NavItem href="/reports/fines" icon={<AlertCircle size={20} />} label="Multas" />
            <NavItem href="/reports/activity" icon={<Users size={20} />} label="Actividad Socios" />
            <NavItem href="/reports/inventory" icon={<Boxes size={20} />} label="Inventario" />
          </nav>

          <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
            Usuario: <span className="text-emerald-400">app_user</span> (LECTURA)
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
