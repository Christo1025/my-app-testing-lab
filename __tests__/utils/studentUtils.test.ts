import { Task } from '../../src/types';
import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { validateTaskTitle } from '../../src/utils/validateTask';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Comprar leche',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Estudiar Jest',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Hacer ejercicio',
    status: 'pending'
  }
];

describe('Pruebas unitarias - validateTaskTitle', () => {

  it('Debe retornar null cuando el título es válido', () => {
    expect(validateTaskTitle('Comprar pan')).toBeNull();
  });

  it('Debe retornar error cuando el título está vacío', () => {
    expect(validateTaskTitle('')).toBe('El título es obligatorio');
  });

  it('Debe retornar error cuando el título es null', () => {
    expect(validateTaskTitle(null as any)).toBe('El título es obligatorio');
  });

  it('Debe retornar error cuando el título supera los 100 caracteres', () => {
    const titulo = 'A'.repeat(101);

    expect(validateTaskTitle(titulo))
      .toBe('El título no puede exceder los 100 caracteres');
  });

});

describe('Pruebas unitarias - filterTasksByStatus', () => {

  it('Debe retornar únicamente las tareas pendientes', () => {

    const result = filterTasksByStatus(mockTasks, 'pending');

    expect(result).toEqual([
      {
        id: '1',
        title: 'Comprar leche',
        status: 'pending'
      },
      {
        id: '3',
        title: 'Hacer ejercicio',
        status: 'pending'
      }
    ]);

  });

  it('Debe contener la tarea "Estudiar Jest" cuando se filtran las completadas', () => {

    const result = filterTasksByStatus(mockTasks, 'completed');

    const titulos = result.map(task => task.title);

    expect(titulos).toContain('Estudiar Jest');

  });

  it('Debe lanzar una excepción cuando el estado es inválido', () => {

    expect(() =>
      filterTasksByStatus(mockTasks, 'cancelada' as any)
    ).toThrow();

  });

  it('Debe retornar un arreglo vacío cuando la lista de tareas está vacía', () => {

    const result = filterTasksByStatus([], 'pending');

    expect(result).toEqual([]);

  });

});