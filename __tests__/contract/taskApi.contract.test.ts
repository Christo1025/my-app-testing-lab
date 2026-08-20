import {
  CreateTaskRequestSchema,
  CreateTaskResponseSchema,
  TaskListSchema,
  TaskSchema,
} from '../../src/schemas/taskSchema';

describe('API Contract - Tasks', () => {
  it('la respuesta de GET /tasks cumple con el esquema esperado', () => {
    const apiResponse = [
      { id: '1', title: 'Tarea 1', status: 'pending' },
      { id: '2', title: 'Tarea 2', status: 'completed' },
    ];
    const result = TaskListSchema.safeParse(apiResponse);
    expect(result.success).toBe(true);
  });

  it('detecta cuando la API devuelve un campo con tipo incorrecto', () => {
    const invalidResponse = { id: 123, title: 'Test', status: 'pending' };
    const result = TaskSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('detecta cuando la API omite un campo requerido', () => {
    const incompleteResponse = { id: '1', status: 'pending' };
    const result = TaskSchema.safeParse(incompleteResponse);
    expect(result.success).toBe(false);
  });

  it('detecta cuando la API envía un status inválido', () => {
    const invalidStatus = { id: '1', title: 'Test', status: 'archived' };
    const result = TaskSchema.safeParse(invalidStatus);
    expect(result.success).toBe(false);
  });

  it('la solicitud y respuesta de POST /tasks cumplen con el contrato esperado', () => {
    const requestBody = { title: 'Preparar entrega' };
    const apiResponse = {
      id: 'task-100',
      title: 'Preparar entrega',
      status: 'pending',
      createdAt: '2026-08-19T10:30:00.000Z',
    };

    expect(CreateTaskRequestSchema.safeParse(requestBody).success).toBe(true);
    expect(CreateTaskResponseSchema.safeParse(apiResponse).success).toBe(true);
  });

  it('detecta cuando POST /tasks devuelve una respuesta inválida', () => {
    const invalidApiResponse = {
      id: 'task-101',
      title: '',
      status: 'pending',
    };

    const result = CreateTaskResponseSchema.safeParse(invalidApiResponse);

    expect(result.success).toBe(false);
  });

  it('detecta cuando POST /tasks recibe una solicitud inválida', () => {
    const invalidRequestBody = { title: '   ' };
    const result = CreateTaskRequestSchema.safeParse(invalidRequestBody);

    expect(result.success).toBe(false);
  });
});
