import BugCard from './BugCard';
import { Bug } from '../types/bug';

interface BugListProps {
  bugs: Bug[];
}

export default function BugList({ bugs }: BugListProps) {
  return (
    <div className="space-y-5">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Bug Tracker</h2>
            <p className="text-gray-400 text-sm mt-1">Reportes del equipo de desarrolo: Alfa_01</p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 bg-purple-600 text-white font-medium px-3 rounded-lg">
              {bugs.length}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {bugs.length === 0 ? (
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-300 mb-2 font-medium">No hay bugs reportados aún</p>
            <span className="text-gray-500 text-sm">Cuando encuentres uno, ¡Repórtalo!</span>
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
    </div>
  );
}