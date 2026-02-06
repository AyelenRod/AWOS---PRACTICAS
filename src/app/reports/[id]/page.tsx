import { query } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mapeo de IDs a Vistas y Metadatos
const reportConfig: Record<string, { view: string; title: string; description: string; kpiLabel: string; kpiField?: string }> = {
    '1': {
        view: 'vw_most_borrowed_books',
        title: 'Ranking de Libros Más Prestados',
        description: 'Libros con mayor demanda histórica.',
        kpiLabel: 'Libro Top #1',
        kpiField: 'title'
    },
    '2': {
        view: 'vw_overdue_loans',
        title: 'Préstamos Vencidos',
        description: 'Préstamos que no han sido devueltos a tiempo.',
        kpiLabel: 'Total Atrasados',
        kpiField: 'count' // Calculado
    },
    '3': {
        view: 'vw_fines_summary',
        title: 'Resumen Mensual de Multas',
        description: 'Estado de recaudación por mes.',
        kpiLabel: 'Total Recaudado (Mes Reciente)',
        kpiField: 'collected_amount'
    },
    '4': {
        view: 'vw_member_activity',
        title: 'Actividad de Socios',
        description: 'Resumen de préstamos y mora por socio.',
        kpiLabel: 'Socios Activos',
        kpiField: 'count' // Calculado
    },
    '5': {
        view: 'vw_inventory_health',
        title: 'Salud de Inventario',
        description: 'Disponibilidad de libros por categoría.',
        kpiLabel: 'Categorías Analizadas',
        kpiField: 'count' // Calculado
    }
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params in Next.js 15+ (if strictly typed as promise, usually strictly params is object in 14-)
    // Assuming params is directly available or awaitable depending on Next version. 
    // For safety in modern next (15), awaiting.
    const resolvedParams = await params;
    const config = reportConfig[resolvedParams.id];

    if (!config) {
        notFound();
    }

    let rows = [];
    try {
        const result = await query(`SELECT * FROM ${config.view}`);
        rows = result.rows;
    } catch (error) {
        console.error("Database Error:", error);
        return (
            <div className="p-8 text-center text-red-600">
                Error al conectar con la base de datos. Verifique que el servidor esté corriendo y las credenciales sean correctas.
            </div>
        );
    }

    // Calcular KPI simple
    let kpiValue = 'N/A';
    if (rows.length > 0) {
        if (config.kpiField === 'count') {
            kpiValue = rows.length.toString();
        } else if (config.kpiField && rows[0][config.kpiField] !== undefined) {
            // Si es financiero, formatear
            if (resolvedParams.id === '3') {
                kpiValue = `$${rows[0][config.kpiField]}`;
            } else {
                kpiValue = rows[0][config.kpiField].toString();
            }
        }
    } else {
        kpiValue = "0";
    }

    // Obtener columnas dinámicamente
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    &larr; Volver al Dashboard
                </Link>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
                    <p className="text-gray-600">{config.description}</p>
                </header>

                {/* KPI Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 inline-block min-w-[200px]">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{config.kpiLabel}</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{kpiValue}</p>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {rows.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No hay datos disponibles para este reporte.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        {columns.map((col) => (
                                            <th key={col} className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                {col.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            {columns.map((col) => (
                                                <td key={`${idx}-${col}`} className="p-4 text-sm text-gray-700 whitespace-nowrap">
                                                    {row[col] === true ? 'Sí' : row[col] === false ? 'No' : row[col]?.toString() || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
