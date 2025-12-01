import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CORES, ESPACAMENTOS, FONTES, BORDAS } from '../constants/tema';

export default function Badge({
  texto,
  cor = CORES.primaria,
  estilo
}) {
  return (
    <View style={[estilos.badge, { backgroundColor: cor }, estilo]}>
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    paddingHorizontal: ESPACAMENTOS.pequeno,
    paddingVertical: ESPACAMENTOS.minimo,
    borderRadius: BORDAS.pequeno,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: FONTES.miniatura,
    fontWeight: 'bold',
    color: CORES.textoBranco,
  },
});

