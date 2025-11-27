import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TelaProducao() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Produção - Copa e Cozinha</Text>
      <Text style={estilos.subtitulo}>Em breve: filas de produção para Copa e Cozinha.</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF3E0',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6D4C41',
  },
});
