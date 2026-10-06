import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { useRouter } from 'expo-router';

const DATOS = [
  { id: '1', titulo: 'Elemento 1: Introducción a React Native' },
  { id: '2', titulo: 'Elemento 2: Componentes y Props' },
  { id: '3', titulo: 'Elemento 3: Manejo de Estado con Hooks' },
  { id: '4', titulo: 'Elemento 4: Estilos con StyleSheet' },
  { id: '5', titulo: 'Elemento 5: Navegación y Tablas' },
];

export default function ListaScreen() { 
  const router = useRouter();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.tituloHeader}>Lista de Elementos</Text>

      <FlatList
        data={DATOS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjetaElemento}>
            <Text style={styles.textoElemento}>{item.titulo}</Text>
          </View>
        )}
        contentContainerStyle={styles.listaContenido}
      />

      <View style={styles.botonVolver}>
        <Button title="Volver a Home" onPress={() => router.push('/')} color="#007AFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  tituloHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1C1C1E',
  },
  listaContenido: {
    paddingBottom: 20,
  },
  tarjetaElemento: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  textoElemento: {
    fontSize: 16,
    color: '#3A3A3C',
  },
  botonVolver: {
    marginVertical: 16,
  },
});