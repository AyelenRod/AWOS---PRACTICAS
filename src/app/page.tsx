import Link from 'next/link';

export default function Home() {
  const reports = [
    {
      id: 1,
      title: 'Top Libros Prestados',
      description: 'Ranking de los libros más solicitados por los socios.',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Préstamos Vencidos',
      description: 'Listado de préstamos activos con fecha de entrega expirada.',
      color: 'bg-red-500',
    },
    {
      id: 3,
      title: 'Resumen Financiero',
      description: 'Estado mensual de multas recolectadas y pendientes.',
      color: 'bg-green-500',
    },
    {
      id: 4,
      title: 'Actividad de Socios',
      description: 'Análisis de comportamiento de préstamos y morosidad.',
      color: 'bg-purple-500',
    },
    {
      id: 5,
      title: 'Salud de Inventario',
      description: 'Evaluación de disponibilidad de copias por categoría.',
      color: 'bg-orange-500',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Evaluación Práctica
          </h1>
          <p className="text-gray-600">Dashboard de Reportes - Biblioteca</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              href={`/reports/${report.id}`}
              key={report.id}
              className="block group h-full"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden h-full flex flex-col">
                <div className={`h-2 ${report.color}`} />
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h2>
                  <p className="text-gray-500 text-sm">{report.description}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                    Ver reporte &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
