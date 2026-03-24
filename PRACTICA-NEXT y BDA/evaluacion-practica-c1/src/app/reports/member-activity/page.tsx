import { query } from '@/lib/db';
import Link from 'next/link';

export default async function MemberActivityPage() {
    let rows = [];
    try {
        const result = await query('SELECT * FROM vw_member_activity');
        rows = result.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return (
            <div className="p-8 text-center text-red-600">
                Error al conectar con la base de datos. Verifique que el servidor esté corriendo.
            </div>
        );
    }

    const activeMembers = rows.length;
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Actividad de Socios
                    </h1>
                    <p className="text-gray-600">
                        Resumen de préstamos y mora por socio.
                    </p>
                </header>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 inline-block min-w-[200px]">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Socios Activos
                    </p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{activeMembers}</p>
                </div>

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
                                            <th
                                                key={col}
                                                className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                {col.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            {columns.map((col) => (
                                                <td
                                                    key={`${idx}-${col}`}
                                                    className="p-4 text-sm text-gray-700 whitespace-nowrap"
                                                >
                                                    {row[col]?.toString() || '-'}
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
