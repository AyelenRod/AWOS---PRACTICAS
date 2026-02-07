import { getFinesSummary, getMostBorrowedBooks, getOverdueLoans } from "./actions";
import Link from 'next/link';
import { ArrowRight, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [fines, overdue, popular] = await Promise.all([
    getFinesSummary(),
    getOverdueLoans(1),
    getMostBorrowedBooks(1)
  ]);

  const totalFinesPending = fines.reduce((acc: number, curr) => acc + Number(curr.total_pending), 0);
  const totalOverdue = overdue.data.length;
  const topBook = popular.data[0]?.title || 'N/A';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-600 mt-2">Real-time insights from Library Views.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Pending Fines"
          value={`$${totalFinesPending.toFixed(2)}`}
          desc="Total unpaid amounts"
          icon={<DollarSign className="w-6 h-6 text-red-500" />}
          color="border-l-4 border-red-500"
        />
        <Card
          title="Active Overdue"
          value={totalOverdue.toString()}
          desc="Loans past due date"
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
          color="border-l-4 border-amber-500"
        />
        <Card
          title="Top Trending"
          value={topBook}
          desc="Most borrowed book"
          icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
          color="border-l-4 border-blue-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

function Card({ title, value, desc, icon, color }: DashboardCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
      </div>
      <p className="mt-2 text-xs text-slate-400">{desc}</p>
    </div>
  );
}
