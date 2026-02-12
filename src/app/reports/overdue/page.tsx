import { getOverdueLoans } from "@/app/actions";
import Pagination from "@/components/Pagination";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function OverduePage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const result = await getOverdueLoans(currentPage);

  const leve = result.data.filter(l => Number(l.days_overdue) <= 14).length;
  const moderado = result.data.filter(l => Number(l.days_overdue) > 14 && Number(l.days_overdue) <= 30).length;
  const critico = result.data.filter(l => Number(l.days_overdue) > 30).length;

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-[#2E5AA7] font-bold hover:underline">
        ← Volver al Dashboard
      </Link>

      {/* Banner de Alerta */}
      <div className="rounded-2xl p-6 bg-[#EF4444] text-white">
        <h1 className="text-2xl font-bold">Préstamos Vencidos</h1>
        <p className="text-white/90 text-sm mt-1">Control de libros no devueltos a tiempo</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/10 p-3 rounded-lg border border-white/10">
            <span className="text-[10px] uppercase font-bold opacity-70 text-white">Total</span>
            <p className="text-xl font-bold">{result.totalRecords}</p>
          </div>
          <div className="bg-black/10 p-3 rounded-lg border border-white/10">
            <span className="text-[10px] uppercase font-bold opacity-70 text-white">Vista SQL</span>
            <p className="text-sm font-bold truncate">overdue_loans</p>
          </div>
          <div className="bg-black/10 p-3 rounded-lg border border-white/10 text-center">
             <span className="text-[10px] uppercase font-bold opacity-70 text-white">Página</span>
             <p className="text-sm font-bold">{currentPage}</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Severidad*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#FFA62B] bg-[#FFF8ED] px-2 py-1 rounded">LEVE</span>
            <span className="text-xs text-slate-400">1-14 días</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{leve}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">MODERADO</span>
            <span className="text-xs text-slate-400">15-30 días</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{moderado}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-white bg-[#EF4444] px-2 py-1 rounded tracking-tighter">CRÍTICO</span>
            <span className="text-xs text-slate-400">+30 días</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{critico}</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-end">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Listado de Retrasos</h2>
            <p className="text-xs text-slate-500">Usuarios con devoluciones pendientes</p>
          </div>
          <div className="bg-red-50 px-3 py-1 rounded-lg">
            <span className="text-[10px] font-bold text-red-600 block">EN MORA</span>
            <span className="text-xl font-black text-red-600 leading-none">{result.totalRecords}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase">
                <th className="px-5 py-4 text-left">Socio</th>
                <th className="px-5 py-4 text-left">Libro</th>
                <th className="px-5 py-4 text-left">Límite</th>
                <th className="px-5 py-4 text-center">Retraso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.data.map((loan) => {
                const days = Number(loan.days_overdue);
                let tagColor = 'bg-[#FFA62B]';
                if (days > 30) tagColor = 'bg-[#EF4444]';
                else if (days > 14) tagColor = 'bg-orange-500';

                return (
                  <tr key={loan.loan_id} className="text-slate-700">
                    <td className="px-5 py-4 font-bold">{loan.member_name}</td>
                    <td className="px-5 py-4 text-slate-600">{loan.book_title}</td>
                    <td className="px-5 py-4 text-red-600 font-medium">
                      {new Date(loan.return_date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold text-white ${tagColor}`}>
                          {days} DÍAS
                        </span>
                        {days > 30 && (
                          <span className="text-[8px] font-black text-red-600 animate-pulse uppercase">¡Urgente!</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <Pagination currentPage={currentPage} totalPages={result.totalPages} />
        </div>
      </div>

      {/*Pie de página*/}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          Origen de datos: <span className="text-red-500">vw_overdue_loans</span>
        </p>
      </div>
    </div>
  );
}