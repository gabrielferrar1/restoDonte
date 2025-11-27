import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TelaRelatorio() {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Relatório de Vendas Diárias</Text>
      <Text style={estilos.subtitulo}>Em breve: resumo das vendas do dia.</Text>
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

