import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

// Esta suite cubre los 3 escenarios exigidos por la rúbrica con MSW:
// éxito (201), error de API (500) y datos vacíos ([]).
const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = async () => {
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

  await waitFor(() => {
    expect(screen.getByTestId('input-titulo')).toBeTruthy();
  });
};

afterEach(() => {
  cleanup();
});

describe('CreateTaskScreen - Integración', () => {
  it('crea una tarea y muestra la actualización de la interfaz cuando la API responde con éxito', async () => {
    // Mock de respuesta exitosa para validar el flujo completo UI -> request -> UI actualizada.
    server.use(
      http.post('https://api.taskmanager.com/tasks', async ({ request }) => {
        const body = (await request.json()) as { title: string };

        return HttpResponse.json(
          { id: 'task-1', title: body.title, status: 'pending' },
          { status: 201 }
        );
      }),
      http.get('https://api.taskmanager.com/tasks', () => HttpResponse.json([]))
    );

    await renderScreen();

    fireEvent.changeText(screen.getByTestId('input-titulo'), 'Comprar pan');

    await waitFor(() => {
      expect(screen.getByTestId('input-titulo').props.value).toBe('Comprar pan');
    });

    fireEvent.press(screen.getByTestId('save-button'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });

    expect(await screen.findByText('Comprar pan')).toBeTruthy();
  });

  it('muestra un mensaje de error cuando la API devuelve un error HTTP 500', async () => {
    // Mock de error HTTP para comprobar que la pantalla refleja estado de fallo.
    server.use(
      http.post('https://api.taskmanager.com/tasks', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 })
      ),
      http.get('https://api.taskmanager.com/tasks', () => HttpResponse.json([]))
    );

    await renderScreen();

    fireEvent.changeText(screen.getByTestId('input-titulo'), 'Revisar el servidor');

    await waitFor(() => {
      expect(screen.getByTestId('input-titulo').props.value).toBe('Revisar el servidor');
    });

    fireEvent.press(screen.getByTestId('save-button'));

    expect(await screen.findByText('Error al crear la tarea')).toBeTruthy();
  });

  it('muestra el estado vacío cuando la API devuelve una lista vacía', async () => {
    // Mock de datos vacíos para verificar el mensaje de estado vacío en la pantalla.
    server.use(http.get('https://api.taskmanager.com/tasks', () => HttpResponse.json([])));

    await renderScreen();

    expect(await screen.findByText('No hay tareas aún')).toBeTruthy();
  });
});
