/**
 * BugCard Component
 * Estructura HTML para mostrar un reporte de bug individual
 * 
 * @author Fernando (Estructura HTML)
 */

interface BugCardProps {
  id: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

export default function BugCard({ id, description, priority }: BugCardProps) {
  return (
    <article className={`bug-card priority-${priority.toLowerCase()}`}>
      <div className="bug-card-header">
        <span className="bug-id">#{id}</span>
        <span className={`priority-badge priority-${priority.toLowerCase()}`}>
          {priority}
        </span>
      </div>
      
      <div className="bug-card-body">
        <p className="bug-description">{description}</p>
      </div>
      
      <div className="bug-card-footer">
        <time className="bug-timestamp">
          {new Date().toLocaleDateString('es-MX')}
        </time>
      </div>
    </article>
  );
}
