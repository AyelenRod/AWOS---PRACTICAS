import { getFinesSummary, getMostBorrowedBooks, getOverdueLoans, getInventoryHealth } from "./actions";
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign, BookOpen, Users, Package, Sparkles, BarChart3, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [finesResult, overdue, popular, inventory] = await Promise.all([
    getFinesSummary(1),
    getOverdueLoans(1),
    getMostBorrowedBooks(1),
    getInventoryHealth()
  ]);

  const totalFinesPending = finesResult.data.reduce((acc: number, curr) => acc + Number(curr.total_pending), 0);
  const totalOverdue = overdue.data.length;
  const topBook = popular.data[0]?.title || 'N/A';
  const totalBooks = inventory.reduce((acc, cat) => acc + Number(cat.total_copies), 0);

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] bg-clip-text text-transparent mb-2">
            Dashboard General
          </h1>
          <p className="text-slate-600 text-lg">Análisis en tiempo real del sistema bibliotecario</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-[#FFA62B]/10 to-[#F8E6A0]/10 rounded-2xl border border-[#FFA62B]/20">
          <Sparkles className="w-8 h-8 text-[#FFA62B]" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Multas Pendientes"
          value={`$${totalFinesPending.toFixed(2)}`}
          desc="Total por cobrar"
          icon={<DollarSign className="w-7 h-7" />}
          color="from-red-500 to-red-600"
          link="/reports/fines"
          trend="+12%"
        />
        <MetricCard
          title="Préstamos Vencidos"
          value={totalOverdue.toString()}
          desc="Requieren atención"
          icon={<AlertTriangle className="w-7 h-7" />}
          color="from-[#FFA62B] to-[#F8E6A0]"
          link="/reports/overdue"
          trend="-5%"
        />
        <MetricCard
          title="Libro Más Popular"
          value={topBook.substring(0, 18)}
          desc="Mayor demanda"
          icon={<TrendingUp className="w-7 h-7" />}
          color="from-[#2E5AA7] to-[#86C5FF]"
          link="/reports/most-borrowed"
        />
        <MetricCard
          title="Total Copias"
          value={totalBooks.toString()}
          desc="En inventario"
          icon={<Package className="w-7 h-7" />}
          color="from-emerald-500 to-emerald-600"
          link="/reports/inventory"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#2E5AA7] to-[#86C5FF] rounded-2xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Libros Más Prestados</h3>
            </div>
            <Link href="/reports/most-borrowed" className="flex items-center gap-2 text-sm text-[#2E5AA7] hover:text-[#86C5FF] font-semibold transition-colors group">
              Ver reporte completo 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-3">
            {popular.data.slice(0, 5).map((book, idx) => (
              <div key={book.book_id} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white hover:from-[#2E5AA7]/5 hover:to-[#86C5FF]/5 transition-all duration-300 border border-slate-100 hover:border-[#2E5AA7]/20 group">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA62B] to-[#F8E6A0] flex items-center justify-center font-bold text-white text-sm">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate group-hover:text-[#2E5AA7] transition-colors">{book.title}</p>
                    <p className="text-sm text-slate-500 truncate">{book.author}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#2E5AA7] to-[#86C5FF] text-white shadow-lg shadow-[#2E5AA7]/20">
                    {book.total_loans}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Estado de Inventario</h3>
            </div>
            <Link href="/reports/inventory" className="text-emerald-600 hover:text-emerald-700 transition-colors">
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="space-y-6">
            {inventory.slice(0, 4).map((cat) => {
              const availability = Number(cat.availability_percentage);
              let statusColor = 'from-emerald-500 to-emerald-600';
              let bgColor = 'bg-emerald-50';
              
              if (availability < 30) {
                statusColor = 'from-red-500 to-red-600';
                bgColor = 'bg-red-50';
              } else if (availability < 60) {
                statusColor = 'from-[#FFA62B] to-[#F8E6A0]';
                bgColor = 'bg-amber-50';
              }

              return (
                <div key={cat.category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-sm">{cat.category}</span>
                    <span className="text-sm font-bold text-slate-900">{availability.toFixed(0)}%</span>
                  </div>
                  <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${statusColor} rounded-full transition-all duration-500 shadow-sm`}
                      style={{ width: `${availability}%` }}
                    />
                  </div>
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="font-medium">Total: {cat.total_copies}</span>
                    <span>•</span>
                    <span>Disponibles: {cat.count_available}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#2E5AA7] via-[#2E5AA7] to-[#1e3a5f] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#86C5FF] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA62B] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <BarChart3 className="w-8 h-8 text-[#FFA62B]" />
              </div>
              <h3 className="text-3xl font-bold">Reportes Disponibles</h3>
            </div>
            <p className="text-white/80 text-lg mb-8 max-w-2xl">
              Accede a análisis detallados con vistas SQL optimizadas e indexadas para máximo rendimiento
            </p>
            <div className="flex gap-4">
              <Link href="/reports/most-borrowed" className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20">
                Explorar Reportes
              </Link>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-[#F8E6A0]">5</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Vistas SQL</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-[#F8E6A0]">{popular.totalPages}</div>
              <div className="text-sm text-white/70 uppercase tracking-wide">Páginas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  trend?: string;
}

function MetricCard({ title, value, desc, icon, color, link, trend }: MetricCardProps) {
  return (
    <Link href={link} className="group block">
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 bg-gradient-to-br ${color} rounded-2xl shadow-lg`}>
              <div className="text-white">{icon}</div>
            </div>
            {trend && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">{title}</p>
            <div className="text-3xl font-bold text-slate-900 mb-1 truncate">{value}</div>
            <p className="text-sm text-slate-400">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}