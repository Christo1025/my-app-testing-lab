import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { TaskForm } from '../../src/components/TaskForm';

describe('TaskForm', () => {

  it('renderiza el campo de título de la tarea', async () => {

    await render(
      <TaskForm onSubmit={() => {}} />
    );

    expect(
      screen.getByPlaceholderText(
        'Escribe el título de la tarea'
      )
    ).toBeTruthy();

  });


  it('permite escribir texto en el campo de título', async () => {

    await render(
      <TaskForm onSubmit={() => {}} />
    );

    const input = screen.getByPlaceholderText(
      'Escribe el título de la tarea'
    );

    await fireEvent.changeText(
      input,
      'Nueva tarea'
    );

    expect(input.props.value)
      .toBe('Nueva tarea');

  });


  it('llama a onSubmit con el título ingresado al presionar Guardar', async () => {

    /*
      Se utiliza jest.fn() para aislar la función onSubmit.
      Esto permite comprobar el comportamiento del componente TaskForm
      sin ejecutar la lógica real de creación o almacenamiento de tareas.
      El mock permite verificar únicamente que el componente envía
      correctamente el título recibido.
    */
    const mockOnSubmit = jest.fn();

    await render(
      <TaskForm onSubmit={mockOnSubmit} />
    );


    await fireEvent.changeText(
      screen.getByPlaceholderText(
        'Escribe el título de la tarea'
      ),
      'Mi nueva tarea'
    );


    await fireEvent.press(
      screen.getByText('Guardar')
    );


    expect(mockOnSubmit)
      .toHaveBeenCalledWith('Mi nueva tarea');

  });


  it('no llama a onSubmit si el campo está vacío', async () => {

    /*
      Se utiliza jest.fn() como mock del callback onSubmit.
      Se aísla esta dependencia para validar que el formulario
      bloquea envíos inválidos cuando el título está vacío.
    */
    const mockOnSubmit = jest.fn();


    await render(
      <TaskForm onSubmit={mockOnSubmit} />
    );


    await fireEvent.press(
      screen.getByText('Guardar')
    );


    expect(mockOnSubmit)
      .not
      .toHaveBeenCalled();

  });

});