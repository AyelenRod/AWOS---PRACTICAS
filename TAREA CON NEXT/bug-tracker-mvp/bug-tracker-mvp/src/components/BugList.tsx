/**
 * BugList Component
 * Estructura HTML para listar todos los reportes de bugs
 * Muestra los bugs de prioridad Alta primero
 * 
 * @author Fernando (Estructura HTML)
 */

import BugCard from './BugCard';

interface Bug {
  id: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

interface BugListProps {
  bugs: Bug[];
}

export default function BugList({ bugs }: BugListProps) {
  return (
    <section className="bug-list-container">
      <header className="bug-list-header">
        <h2 className="bug-list-title">Reportes Activos</h2>
        <span className="bug-count">{bugs.length} bugs reportados</span>
      </header>

      <div className="bug-list-grid">
        {bugs.length === 0 ? (
          <div className="empty-state">
            <p>No hay bugs reportados aún</p>
            <span>¡Comienza reportando el primer bug!</span>
          </div>
        ) : (
          bugs.map((bug) => (
            <BugCard
              key={bug.id}
              id={bug.id}
              description={bug.description}
              priority={bug.priority}
            />
          ))
        )}
      </div>
    </section>
  );
}
