import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CORES, ESPACAMENTOS, FONTES, BORDAS, SOMBRAS } from '../constants/tema';

export default function Card({
  children,
  titulo,
  icone,
  corIcone = CORES.primaria,
  estilo
}) {
  return (
    <View style={[estilos.card, estilo]}>
      {(titulo || icone) && (
        <View style={estilos.cabecalho}>
          {icone && (
            <MaterialIcons name={icone} size={24} color={corIcone} style={estilos.icone} />
          )}
          {titulo && <Text style={estilos.titulo}>{titulo}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: CORES.fundoCard,
    borderRadius: BORDAS.grande,
    padding: ESPACAMENTOS.medio,
    marginBottom: ESPACAMENTOS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    ...SOMBRAS.pequena,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.pequeno,
  },
  icone: {
    marginRight: ESPACAMENTOS.pequeno,
  },
  titulo: {
    fontSize: FONTES.grande,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    flex: 1,
  },
});

