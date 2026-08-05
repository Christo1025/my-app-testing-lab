import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';
let fallbackTasks: Task[] = [];

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`);

    if (!res.ok) {
      throw new Error('Error al obtener las tareas');
    }

    const tasks = await res.json();

    if (Array.isArray(tasks)) {
      fallbackTasks = tasks;
      return tasks;
    }

    throw new Error('Respuesta inválida');
  } catch {
    return fallbackTasks;
  }
}

export async function createTask(title: string): Promise<Task> {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error('Error al crear la tarea');
    }

    const createdTask = await res.json();

    fallbackTasks = [createdTask, ...fallbackTasks.filter((task) => task.id !== createdTask.id)];

    return createdTask;
  } catch {
    // Propagamos el error para que la UI pueda mostrar feedback de fallo (escenario API 500).
    throw new Error('Error al crear la tarea');
  }
}
