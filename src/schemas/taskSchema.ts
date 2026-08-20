import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.enum(['pending', 'completed']),
  createdAt: z.string().datetime().optional(),
});

export const TaskListSchema = z.array(TaskSchema);

export const CreateTaskRequestSchema = z.object({
  title: z.string().trim().min(1),
});

export const CreateTaskResponseSchema = TaskSchema;

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
