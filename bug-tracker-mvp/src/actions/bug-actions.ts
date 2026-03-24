'use server';

import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { getBugsDB, saveBugDB } from '@/lib/db';
import { Bug, Priority } from '@/types/bug';

// Sirve para definir los niveles de prioridad de los bugs con los que trabaja "getBugs()"
const priorityOrder: Record<Priority, number> = {
  'Alta': 1,
  'Media': 2,
  'Baja': 3
};

// Se encarga de ordenar los bugs de mayor a menor prioridad
export async function getBugs() {
  const bugs = await getBugsDB();
  
  return bugs.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export async function createBug(formData: FormData) {
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as Priority;

  // Valida la extensión mínima y una prioridad válida para los reportes de bugs
  if (!description || description.length < 5) {
    throw new Error('La descripción debe tener al menos 5 caracteres.');
  }
  
  if (!['Alta', 'Media', 'Baja'].includes(priority)) {
    throw new Error('La prioridad no válida.');
  }

  // Se crea el nuevo objeto 'Bug'
  const newBug: Bug = {
    id: randomUUID(),
    description,
    priority,
    createdAt: new Date().toISOString()
  };

  // Guarda el bug en el JSON
  await saveBugDB(newBug);

  // Revalida el path para estar actualizado
  revalidatePath('/');
}