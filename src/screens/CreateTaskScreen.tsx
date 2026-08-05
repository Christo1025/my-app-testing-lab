import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateTask } from '../hooks/useCreateTask';

export function CreateTaskScreen() {
  const { status, tasks, submit } = useCreateTask();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = React.useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    void submit(title.trim());
  };

  return (
    <View
      style={{ flex: 1, gap: 16, padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <Text>Nueva tarea</Text>
      <TextInput
        testID="input-titulo"
        accessibilityLabel="Titulo de la tarea"
        accessibilityHint="Escribe el titulo para la nueva tarea"
        placeholder="Escribe el título de la tarea"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity
        testID="save-button"
        accessibilityRole="button"
        accessibilityLabel="Guardar"
        onPress={handleSubmit}
      >
        <Text>Guardar</Text>
      </TouchableOpacity>
      {status === 'success' && <Text>Tarea creada exitosamente</Text>}
      {status === 'error' && <Text>Error al crear la tarea</Text>}
      {tasks.length === 0 ? <Text>No hay tareas aún</Text> : tasks.map((task) => <Text key={task.id}>{task.title}</Text>)}
    </View>
  );
}
