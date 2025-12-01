import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CORES, ESPACAMENTOS, FONTES, BORDAS, SOMBRAS } from '../constants/tema';

export default function Botao({
  titulo,
  onPress,
  variante = 'primario',
  tamanho = 'medio',
  carregando = false,
  desabilitado = false,
  larguraCompleta = false,
  estilo,
  estiloTexto
}) {
  const estilos = criarEstilos(variante, tamanho, larguraCompleta);

  return (
    <TouchableOpacity
      style={[
        estilos.botao,
        (desabilitado || carregando) && estilos.desabilitado,
        estilo
      ]}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.7}
    >
      {carregando ? (
        <ActivityIndicator
          color={variante === 'primario' ? CORES.textoBranco : CORES.primaria}
          size="small"
        />
      ) : (
        <Text style={[estilos.texto, estiloTexto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

function criarEstilos(variante, tamanho, larguraCompleta) {
  const estilosBase = StyleSheet.create({
    botao: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDAS.medio,
      paddingVertical: tamanho === 'pequeno' ? ESPACAMENTOS.pequeno :
                        tamanho === 'grande' ? ESPACAMENTOS.grande : ESPACAMENTOS.medio,
      paddingHorizontal: tamanho === 'pequeno' ? ESPACAMENTOS.medio :
                          tamanho === 'grande' ? ESPACAMENTOS.extraGrande : ESPACAMENTOS.grande,
      width: larguraCompleta ? '100%' : 'auto',
      backgroundColor: variante === 'primario' ? CORES.primaria :
                        variante === 'secundario' ? CORES.fundoBranco :
                        variante === 'sucesso' ? CORES.sucesso :
                        variante === 'erro' ? CORES.erro : CORES.alerta,
      borderWidth: variante === 'secundario' ? 1 : 0,
      borderColor: variante === 'secundario' ? CORES.bordaMedia : 'transparent',
      ...SOMBRAS.pequena,
    },
    texto: {
      fontSize: tamanho === 'pequeno' ? FONTES.pequena :
                tamanho === 'grande' ? FONTES.grande : FONTES.media,
      fontWeight: 'bold',
      color: variante === 'secundario' ? CORES.primaria : CORES.textoBranco,
    },
    desabilitado: {
      opacity: 0.5,
    },
  });

  return estilosBase;
}

