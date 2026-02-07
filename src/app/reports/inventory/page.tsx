import { getInventoryHealth } from "@/app/actions";
import { ReportHeader } from "@/components/ReportUI";
import { Package, CheckCircle, Clock, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const data = await getInventoryHealth();

    const totalCopies = data.reduce((acc, cat) => acc + Number(cat.total_copies), 0);
    const totalAvailable = data.reduce((acc, cat) => acc + Number(cat.count_available), 0);
    const totalLoaned = data.reduce((acc, cat) => acc + Number(cat.count_loaned), 0);
    const overallAvailability = (totalAvailable / totalCopies * 100) || 0;

    return (
        <div className="space-y-6">
            <ReportHeader
                title="Salud del Inventario"
                description="Estado y distribución de copias físicas por categoría literaria"
            />

            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    label="Total Copias"
                    value={totalCopies.toString()}
                    icon={<Package className="w-5 h-5" />}
                    color="bg-slate-500"
                />
                <StatCard
                    label="Disponibles"
                    value={totalAvailable.toString()}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="bg-green-500"
                />
                <StatCard
                    label="En Préstamo"
                    value={totalLoaned.toString()}
                    icon={<Clock className="w-5 h-5" />}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Disponibilidad"
                    value={`${overallAvailability.toFixed(1)}%`}
                    icon={<AlertCircle className="w-5 h-5" />}
                    color="bg-amber-500"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((category) => {
                    const availability = Number(category.availability_percentage);
                    const total = Number(category.total_copies);
                    const available = Number(category.count_available);
                    const loaned = Number(category.count_loaned);
                    const lost = Number(category.count_lost);

                    let statusConfig = {
                        label: 'Buena disponibilidad',
                        color: 'bg-green-500',
                        textColor: 'text-green-700',
                        bgColor: 'bg-green-50',
                        borderColor: 'border-green-200'
                    };

                    if (availability < 30) {
                        statusConfig = {
                            label: 'Disponibilidad crítica',
                            color: 'bg-red-500',
                            textColor: 'text-red-700',
                            bgColor: 'bg-red-50',
                            borderColor: 'border-red-200'
                        };
                    } else if (availability < 60) {
                        statusConfig = {
                            label: 'Disponibilidad moderada',
                            color: 'bg-amber-500',
                            textColor: 'text-amber-700',
                            bgColor: 'bg-amber-50',
                            borderColor: 'border-amber-200'
                        };
                    }

                    return (
                        <div key={category.category} className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.borderColor} overflow-hidden transition-all hover:shadow-md`}>
                            <div className={`${statusConfig.bgColor} px-6 py-4 border-b ${statusConfig.borderColor}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 text-lg">{category.category}</h3>
                                    <Package className="w-6 h-6 text-slate-400" />
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="text-center pb-4 border-b border-slate-100">
                                    <div className="text-3xl font-bold text-slate-900 mb-1">{total}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total de Copias</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 font-medium">Disponibles</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${statusConfig.textColor}`}>{available}</span>
                                            <span className="text-slate-400">({availability.toFixed(1)}%)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className={`h-full ${statusConfig.color} transition-all duration-500`}
                                            style={{ width: `${availability}%` }}
                                        />
                                    </div>

                                    <div className="pt-2 space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                                <span className="text-slate-600">En Préstamo</span>
                                            </div>
                                            <span className="font-semibold text-slate-900">{loaned}</span>
                                        </div>
                                        
                                        {Number(lost) > 0 && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                                    <span className="text-slate-600">Perdidos/Mant.</span>
                                                </div>
                                                <span className="font-semibold text-red-600">{lost}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`mt-4 pt-4 border-t ${statusConfig.borderColor}`}>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                        <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                                        {statusConfig.label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-500 bg-opacity-10 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Recomendaciones</h3>
                        <p className="text-sm text-slate-600">
                            Las categorías con disponibilidad inferior al 30% requieren atención inmediata. 
                            Considera adquirir más copias de títulos populares en estas categorías.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { 
    label: string; 
    value: string; 
    icon: React.ReactNode; 
    color: string; 
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${color} bg-opacity-10 rounded-lg`}>
                    <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
            </div>
        </div>
    );
}