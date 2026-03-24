import BugList from '@/components/BugList';
import BugForm from '@/components/BugForm';
import { getBugs, createBug } from '@/actions/bug-actions'; // Importamos la lógica real

export default async function Home() {
  const bugs = await getBugs(); // Obtiene los bugs que hay en el JSON  

  // Maneja el formulario y errores
  async function handleSubmit(formData: FormData) {
    'use server';
    await createBug(formData);
    console.log('FormData recibido:', { // Feedback del sistema
      description: formData.get('description'),
      priority: formData.get('priority'),
    });
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-purple-900 border-b border-purple-600/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-white">Bug Tracker MVP</h1>
          <p className="text-purple-200 mt-1">
            Sistema de reporte de bugs para un equipo de desarrollo interno
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <BugForm onSubmit={handleSubmit} />
          </aside>

          <section className="lg:col-span-2">
            <BugList bugs={bugs} />
          </section>
        </div>
      </main>

      <footer className="bg-purple-900 border-t border-purple-600/500 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-purple-200 text-sm">
            Like si ves esto :D
          </p>
        </div>
      </footer>
    </div>
  );
}