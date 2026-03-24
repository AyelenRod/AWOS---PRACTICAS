import fs from 'fs/promises';
import path from 'path';
import { Bug } from '@/types/bug';

// Ruta del archivo JSON
const DB_PATH = path.join(process.cwd(), 'data', 'bugs.json');

export async function getBugsDB(): Promise<Bug[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');

    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo base de datos:', error); //En caso de error, se devuelve un array vacío para no romper la app

    return [];
  }
}

export async function saveBugDB(bug: Bug): Promise<void> {
  const bugs = await getBugsDB(); //Obtiene los bugs que hay
  
  bugs.push(bug); // Añade el nuevo bug
  
  await fs.writeFile(DB_PATH, JSON.stringify(bugs, null, 2), 'utf-8'); // Reescribe todo el JSON añadiendo el nuevo bug
}
