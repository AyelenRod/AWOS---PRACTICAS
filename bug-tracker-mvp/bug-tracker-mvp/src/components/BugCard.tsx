interface BugCardProps {
  id: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

export default function BugCard({ id, description, priority }: BugCardProps) {
  const priorityConfig = {
    Alta: {
      bg: 'bg-red-900/50',
      border: 'border-4 border-red-800',
      badge: 'bg-red-600',
      text: 'text-red-400',
      icon: '!!!',
    },
    Media: {
      bg: 'bg-gray-900',
      border: 'border-yellow-800',
      badge: 'bg-yellow-600',
      text: 'text-yellow-400',
      icon: '!',
    },
    Baja: {
      bg: 'bg-gray-900',
      border: 'border-green-800',
      badge: 'bg-green-600',
      text: 'text-green-400',
      icon: '?',
    }
  };

  const config = priorityConfig[priority];

  return (
    <article className={`${config.bg} rounded-xl shadow-md border ${config.border} p-5 transition-all hover:shadow-lg hover:border-gray-700`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 ${config.badge} rounded-lg text-white text-sm`}>
            {config.icon}
          </div>
          <div>
            <p className={`${config.text} text-sm font-medium`}>ID: {id}</p>
          </div>
        </div>
        <span className={`${config.badge} text-white text-xs font-medium px-3 py-1 rounded-full`}>
          {priority}
        </span>
      </div>
      
      <p className="text-gray-200 text-sm leading-relaxed mb-3">
        {description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3">
        <div className="flex items-center gap-2">
          <time>{new Date().toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          })}</time>
        </div>
      </div>
    </article>
  );
}