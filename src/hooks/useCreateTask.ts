import { useEffect, useState } from 'react';
import { createTask, fetchTasks } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const initialTasks = await fetchTasks();
        if (!cancelled) {
          setTasks(initialTasks);
        }
      } catch {
        if (!cancelled) {
          setTasks([]);
        }
      }
    };

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (title: string) => {
    setStatus('loading');

    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return { status, tasks, submit };
}
