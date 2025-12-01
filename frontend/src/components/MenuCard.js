import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tinycolor from 'tinycolor2';
import { CORES, ESPACAMENTOS, FONTES, BORDAS, SOMBRAS } from '../constants/tema';

const MenuCard = ({ titulo, descricao, icone, cor = CORES.primaria, onPress }) => {
  const backgroundColor = tinycolor(cor).setAlpha(0.12).toRgbString();

  return (
    <TouchableOpacity style={styles.cardMenu} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconeContainer, { backgroundColor }]}>
        <MaterialIcons name={icone} size={40} color={cor} />
      </View>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.cardDescricao}>{descricao}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardMenu: {
    width: '48%',
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.grande,
    padding: ESPACAMENTOS.medio,
    marginBottom: ESPACAMENTOS.medio,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CORES.bordaClara,
    ...SOMBRAS.media,
  },
  iconeContainer: {
    width: 70,
    height: 70,
    borderRadius: BORDAS.grande,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.pequeno,
  },
  cardTitulo: {
    fontSize: FONTES.normal,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    marginBottom: ESPACAMENTOS.minimo,
    textAlign: 'center',
  },
  cardDescricao: {
    fontSize: FONTES.pequena,
    color: CORES.textoClaro,
    textAlign: 'center',
  },
});

export default MenuCard;
