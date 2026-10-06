import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [texto, setTexto] = useState('');
  const router = useRouter();

  const mostrarAlerta = () => {
    if (texto.trim() === '') {
      Alert.alert('Atención', 'Por favor ingresa un texto.');
    } else {
      Alert.alert('Texto Ingresado', texto);
    }
  };

  return (
    <View style={styles.contenedorPrincipal}>
      <View style={styles.tarjetaUsuario}>
        <Text style={styles.textoNombre}>Nathaly Vasquez</Text>
        <Text style={styles.textoCarnet}>Carnet: 2023-0123</Text>
      </View>

      <View style={styles.seccionFormulario}>
        <TextInput
          style={styles.campoTexto}
          placeholder="Escribe algo aquí..."
          value={texto}
          onChangeText={setTexto}
        />
        <Button title="Mostrar Texto" onPress={mostrarAlerta} color="#007AFF" />
      </View>

      <View style={styles.seccionNavegacion}>
        <Button
          title="Ir a la lista de elementos"
          onPress={() => router.push('/two')}
          color="#34C759"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
  },
  tarjetaUsuario: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textoNombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  textoCarnet: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  seccionFormulario: {
    marginBottom: 20,
  },
  campoTexto: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  seccionNavegacion: {
    marginTop: 10,
  },
});