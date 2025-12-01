import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { CORES, FONTES, ESPACAMENTOS, BORDAS } from '../constants/tema';

const Input = ({ label, erro, ...props }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, erro && styles.inputErro]}
        placeholderTextColor={CORES.textoClaro}
        {...props}
      />
      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: ESPACAMENTOS.medio,
  },
  label: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    paddingHorizontal: ESPACAMENTOS.medio,
    fontSize: FONTES.normal,
    color: CORES.textoEscuro,
  },
  inputErro: {
    borderColor: CORES.erro,
  },
  textoErro: {
    fontSize: FONTES.pequena,
    color: CORES.erro,
    marginTop: ESPACAMENTOS.minimo,
  },
});

export default Input;

