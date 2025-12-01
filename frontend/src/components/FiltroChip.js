import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CORES, FONTES, BORDAS, ESPACAMENTOS } from '../constants/tema';

const FiltroChip = ({ label, ativo, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, ativo && styles.chipAtivo]}
      onPress={onPress}
    >
      <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: ESPACAMENTOS.medio,
    paddingVertical: ESPACAMENTOS.pequeno,
    borderRadius: BORDAS.circular,
    backgroundColor: CORES.fundoBranco,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    marginRight: ESPACAMENTOS.pequeno,
  },
  chipAtivo: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  chipTexto: {
    fontSize: FONTES.pequena,
    color: CORES.textoMedio,
    fontWeight: '600',
  },
  chipTextoAtivo: {
    color: CORES.textoBranco,
  },
});

export default FiltroChip;

