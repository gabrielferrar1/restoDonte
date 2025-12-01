import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CORES, ESPACAMENTOS, FONTES, BORDAS } from '../constants/tema';

const BarraBusca = ({ valor, aoMudarTexto, placeholder = "Buscar..." }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color={CORES.textoClaro} style={styles.icone} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={valor}
        onChangeText={aoMudarTexto}
        placeholderTextColor={CORES.textoClaro}
      />
      {valor.length > 0 && (
        <TouchableOpacity onPress={() => aoMudarTexto('')}>
          <MaterialIcons name="close" size={24} color={CORES.textoClaro} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.fundoBranco,
    marginHorizontal: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.medio,
    paddingHorizontal: ESPACAMENTOS.medio,
    borderRadius: BORDAS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
  },
  icone: {
    marginRight: ESPACAMENTOS.pequeno,
  },
  input: {
    flex: 1,
    paddingVertical: ESPACAMENTOS.medio,
    fontSize: FONTES.media,
    color: CORES.textoEscuro,
  },
});

export default BarraBusca;

