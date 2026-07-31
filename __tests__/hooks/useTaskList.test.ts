import { act, renderHook } from '@testing-library/react-native';
import { useTaskList } from '../../src/hooks/useTaskList';

describe('useTaskList pruebas adicionales', () => {

  it('agrega varias tareas correctamente', async () => {
    const { result } = await renderHook(() => useTaskList());

    await act(() => {
      result.current.addTask('Tarea 1');
      result.current.addTask('Tarea 2');
      result.current.addTask('Tarea 3');
    });

    expect(result.current.tasks).toHaveLength(3);
    expect(result.current.taskCount).toBe(3);
  });

  it('no modifica la lista cuando el id no existe', async () => {
    const initialTasks = [
      {
        id: '1',
        title: 'Tarea',
        status: 'pending' as const,
      },
    ];

    const { result } = await renderHook(() => useTaskList(initialTasks));

    await act(() => {
      result.current.removeTask('100');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe('1');
  });

  it('mantiene el orden de inserción de las tareas', async () => {
    const { result } = await renderHook(() => useTaskList());

    await act(() => {
      result.current.addTask('Primera');
      result.current.addTask('Segunda');
    });

    expect(result.current.tasks[0].title).toBe('Primera');
    expect(result.current.tasks[1].title).toBe('Segunda');
  });

  it('actualiza el contador después de eliminar una tarea', async () => {
    const initialTasks = [
      {
        id: '1',
        title: 'A',
        status: 'pending' as const,
      },
      {
        id: '2',
        title: 'B',
        status: 'pending' as const,
      },
    ];

    const { result } = await renderHook(() => useTaskList(initialTasks));

    expect(result.current.taskCount).toBe(2);

    await act(() => {
      result.current.removeTask('1');
    });

    expect(result.current.taskCount).toBe(1);
  });

});