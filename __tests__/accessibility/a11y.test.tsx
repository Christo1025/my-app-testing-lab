import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';
import HomeScreen from '../../app/(tabs)/index';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

jest.mock('../../src/hooks/useCreateTask', () => ({
  useCreateTask: () => ({ status: 'idle', tasks: [], submit: jest.fn() }),
}));

describe('CreateTaskScreen - accesibilidad', () => {
  it('el campo de texto tiene accessibilityLabel descriptivo', async () => {
    await render(<CreateTaskScreen />);
    const input = screen.getByLabelText('Titulo de la tarea');
    expect(input).toBeTruthy();
  });

  it('el boton Guardar tiene accessibilityRole button', async () => {
    await render(<CreateTaskScreen />);
    const btn = screen.getByRole('button', { name: /guardar/i });
    expect(btn).toBeTruthy();
  });
});

describe('HomeScreen - accesibilidad', () => {
  it('el boton Crear tarea tiene accessibilityLabel descriptivo', async () => {
    await render(<HomeScreen />);
    const btn = screen.getByLabelText('Ir a crear tarea');
    expect(btn).toBeTruthy();
  });

  it('el boton Crear tarea tiene accessibilityRole button', async () => {
    await render(<HomeScreen />);
    const btn = screen.getByRole('button', { name: /crear tarea/i });
    expect(btn).toBeTruthy();
  });
});
