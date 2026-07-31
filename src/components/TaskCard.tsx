import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onDelete = () => {} }: TaskCardProps) {
  const isCompleted =
    task.completed === true ||
    task.status === 'completed';

  return (
    <View testID="task-card">
      <Text>
        {task.title}
      </Text>

      <Text>
        {isCompleted ? '✓ Completada' : '○ Pendiente'}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Eliminar tarea ${task.title}`}
        onPress={() => onDelete(task.id)}
      >
        <Text>
          Eliminar
        </Text>
      </Pressable>
    </View>
  );
}