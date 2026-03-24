'use client';

interface BugFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function BugForm({ onSubmit }: BugFormProps) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Reportar Bug
        </h2>
        <p className="text-gray-400 text-sm">
          Describe el bug y selecciona su prioridad
        </p>
      </div>

      <form action={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all resize-none"
            placeholder="Describe el bug en detalle..."
            rows={4}
            required
            minLength={5}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
            required
            defaultValue=""
          >
            <option value="" disabled className="text-gray-500">
              Seleccionar prioridad
            </option>
            <option value="Alta" className="text-red-600">🔴 Alta</option>
            <option value="Media" className="text-yellow-600">🟡 Media</option>
            <option value="Baja" className="text-green-600">🟢 Baja</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
        >
          <span>Reportar Bug</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
    </div>
  );
}