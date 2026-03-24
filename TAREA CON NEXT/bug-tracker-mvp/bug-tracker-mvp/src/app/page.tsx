/**
 * Bug Tracker MVP - Página Principal
 * Estructura HTML principal que integra BugList y BugForm
 * 
 * @author Fernando (Estructura HTML)
 * @author Moisés (Lógica TypeScript y Server Actions)
 */

import BugList from '@/components/BugList';
import BugForm from '@/components/BugForm';

// TODO: Moisés - Importar la Server Action aquí
// import { createBug } from '@/actions/bugActions';

// TODO: Moisés - Obtener bugs desde la persistencia
const mockBugs = [
  {
    id: '1',
    description: 'Error en el login cuando el usuario ingresa credenciales incorrectas más de 3 veces',
    priority: 'Alta' as const,
  },
  {
    id: '2',
    description: 'El botón de guardar no responde en formularios largos',
    priority: 'Media' as const,
  },
  {
    id: '3',
    description: 'Texto desalineado en la página de perfil en dispositivos móviles',
    priority: 'Baja' as const,
  },
];

export default function Home() {
  // TODO: Moisés - Implementar la función que manejará el submit del formulario
  async function handleSubmit(formData: FormData) {
    'use server';
    // Aquí Moisés implementará la lógica de Server Action
    console.log('FormData recibido:', {
      description: formData.get('description'),
      priority: formData.get('priority'),
    });
  }

  return (
    <div className="app-container">
      {/* Header de la aplicación */}
      <header className="app-header">
        <h1 className="app-title">🐛 Bug Tracker MVP</h1>
        <p className="app-subtitle">
          Sistema de reporte de bugs para el equipo de desarrollo
        </p>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        {/* Columna izquierda: Formulario */}
        <aside className="app-sidebar">
          <BugForm onSubmit={handleSubmit} />
        </aside>

        {/* Columna derecha: Lista de bugs */}
        <section className="app-content">
          <BugList bugs={mockBugs} />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Bug Tracker MVP © 2025 | Desarrollado por el Equipo 5°C</p>
      </footer>
    </div>
  );
}
