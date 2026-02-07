import { getFinesSummary, getMostBorrowedBooks, getOverdueLoans, getInventoryHealth } from "./actions";
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign, BookOpen, Users, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [fines, overdue, popular, inventory] = await Promise.all([
    getFinesSummary(),
    getOverdueLoans(1),
    getMostBorrowedBooks(1),
    getInventoryHealth()
  ]);

  const totalFinesPending = fines.reduce((acc: number, curr) => acc + Number(curr.total_pending), 0);
  const totalOverdue = overdue.data.length;
  const topBook = popular.data[0]?.title || 'N/A';
  const totalBooks = inventory.reduce((acc, cat) => acc + Number(cat.total_copies), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard General</h2>
        <p className="text-slate-600 mt-2">Visión completa del estado de la biblioteca en tiempo real</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Multas Pendientes"
          value={`$${totalFinesPending.toFixed(2)}`}
          desc="Total por cobrar"
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-red-500"
          link="/reports/fines"
        />
        <MetricCard
          title="Préstamos Vencidos"
          value={totalOverdue.toString()}
          desc="Requieren atención"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-amber-500"
          link="/reports/overdue"
        />
        <MetricCard
          title="Libro Más Popular"
          value={topBook.substring(0, 20)}
          desc="Mayor demanda"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-blue-500"
          link="/reports/most-borrowed"
        />
        <MetricCard
          title="Total Copias"
          value={totalBooks.toString()}
          desc="En inventario"
          icon={<Package className="w-6 h-6" />}
          color="bg-emerald-500"
          link="/reports/inventory"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Libros Más Prestados</h3>
            <Link href="/reports/most-borrowed" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todo <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {popular.data.slice(0, 5).map((book) => (
              <div key={book.book_id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{book.title}</p>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">#{book.rank_most_borrowed}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {book.total_loans} préstamos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Inventario por Categoría</h3>
            <Link href="/reports/inventory" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todo <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {inventory.slice(0, 5).map((cat) => {
              const availability = Number(cat.availability_percentage);
              let statusColor = 'text-green-600';
              if (availability < 30) statusColor = 'text-red-600';
              else if (availability < 60) statusColor = 'text-amber-600';

              return (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{cat.category}</span>
                    <span className={`text-sm font-semibold ${statusColor}`}>
                      {availability}% disponible
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        availability >= 60 ? 'bg-green-500' : 
                        availability >= 30 ? 'bg-amber-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${availability}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>Total: {cat.total_copies}</span>
                    <span>Disponibles: {cat.count_available}</span>
                    <span>Prestados: {cat.count_loaned}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Sistema de Reportes SQL</h3>
            <p className="text-slate-300">Consultas optimizadas con vistas materializadas y índices estratégicos</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{fines.length}</div>
              <div className="text-sm text-slate-400">Periodos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{popular.totalPages}</div>
              <div className="text-sm text-slate-400">Páginas</div>
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
}

function MetricCard({ title, value, desc, icon, color, link }: MetricCardProps) {
  return (
    <Link href={link} className="group">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-slate-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${color} bg-opacity-10 rounded-lg`}>
            <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
    </Link>
  );
}