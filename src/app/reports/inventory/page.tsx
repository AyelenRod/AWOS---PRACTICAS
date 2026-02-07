import { getInventoryHealth } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";
import { Boxes } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const data = await getInventoryHealth();

    return (
        <div>
            <ReportHeader
                title="Inventory Health"
                description="Status distribution of physical copies by category."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {data.map((cat) => (
                    <div key={cat.category} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-800">{cat.category}</h3>
                            <Boxes className="text-slate-300 w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 mb-4">{cat.total_copies} <span className="text-xs font-normal text-slate-400">copies</span></div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Available</span>
                                <span className="font-medium text-green-600">{cat.count_available} ({cat.availability_percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: `${cat.availability_percentage}%` }}></div>
                            </div>

                            <div className="flex justify-between text-slate-500 pt-1">
                                <span>Loaned</span>
                                <span>{cat.count_loaned}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Lost/Maint</span>
                                <span className="text-red-400">{cat.count_lost}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
