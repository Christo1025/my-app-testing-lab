import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

interface TaskFormProps {
  onSubmit: (title: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    onSubmit(cleanTitle);
    setTitle('');
  };

  return (
    <View>
      <TextInput
        testID="input-titulo"
        placeholder="Escribe el título de la tarea"
        value={title}
        onChangeText={setTitle}
      />

      <Button title="Guardar" onPress={handleSubmit} />

      {!title.trim() && (
        <Text testID="error-message">
          El título es obligatorio
        </Text>
      )}
    </View>
  );
}