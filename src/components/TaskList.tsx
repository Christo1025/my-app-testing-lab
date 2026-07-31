import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onDelete = () => {} }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Text testID="empty-message">
        No hay tareas aún
      </Text>
    );
  }

  return (
    <View>
      <Text testID="task-counter">
        {tasks.length === 1
          ? '1 tarea'
          : `${tasks.length} tareas`}
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onDelete={onDelete}
          />
        )}
      />
    </View>
  );
}