/**
 * BugForm Component
 * Estructura HTML del formulario para reportar nuevos bugs
 * Usa <select> nativo para prioridad y envía FormData
 * 
 * @author Fernando (Estructura HTML)
 */

'use client';

interface BugFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function BugForm({ onSubmit }: BugFormProps) {
  return (
    <section className="bug-form-container">
      <header className="bug-form-header">
        <h2 className="bug-form-title">Reportar Nuevo Bug</h2>
        <p className="bug-form-subtitle">
          Describe el bug y selecciona su prioridad
        </p>
      </header>

      <form action={onSubmit} className="bug-form">
        {/* Campo de Descripción */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción del Bug
            <span className="required-mark">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className="form-input form-textarea"
            placeholder="Describe el bug encontrado..."
            rows={4}
            required
            minLength={5}
          />
          <span className="form-hint">Mínimo 5 caracteres</span>
        </div>

        {/* Campo de Prioridad */}
        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Prioridad
            <span className="required-mark">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            className="form-input form-select"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona la prioridad
            </option>
            <option value="Alta">🔴 Alta</option>
            <option value="Media">🟡 Media</option>
            <option value="Baja">🟢 Baja</option>
          </select>
          <span className="form-hint">Indica qué tan crítico es el bug</span>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Reportar Bug
          </button>
          <button type="reset" className="btn btn-secondary">
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
