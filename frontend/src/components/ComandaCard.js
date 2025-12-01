import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CORES, FONTES, ESPACAMENTOS, BORDAS, SOMBRAS, STATUS_COMANDA } from '../constants/tema';
import Botao from './Botao';
import api from '../api/api';

const ComandaCard = ({ item, onPress, onActionComplete }) => {
  const statusInfo = STATUS_COMANDA[item.status] || {};
  const corStatus = statusInfo.cor || CORES.textoClaro;

  const fechar = async () => {
    Alert.alert(
      'Fechar Comanda',
      `Valor total: R$ ${Number(item.valor_total || 0).toFixed(2)}\n\nDeseja fechar a comanda da mesa ${item.numero_mesa}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.put(`/comandas/${item.id}/fechar`);
              onActionComplete && onActionComplete();
            } catch (err) {
              Alert.alert('Erro', err.response?.data?.erro || 'Não foi possível fechar a comanda.');
            }
          },
        },
      ]
    );
  };

  const pagar = async () => {
    Alert.alert(
      'Registrar Pagamento',
      `Valor total: R$ ${Number(item.valor_total || 0).toFixed(2)}\n\nConfirmar pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await api.put(`/comandas/${item.id}/pagar`);
              onActionComplete && onActionComplete();
            } catch (err) {
              Alert.alert('Erro', err.response?.data?.erro || 'Não foi possível registrar o pagamento.');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linhaTitulo}>
        <Text style={styles.mesa}>Mesa {item.numero_mesa}</Text>
        <Text style={[styles.status, { color: corStatus }]}> {statusInfo.label || item.status} </Text>
      </View>
      {item.nome_cliente && (
        <Text style={styles.cliente}>Cliente: {item.nome_cliente}</Text>
      )}
      <Text style={styles.valor}>Total: R$ {Number(item.valor_total || 0).toFixed(2)}</Text>
      <Text style={styles.dica}>Toque para ver os detalhes do pedido.</Text>

      <View style={styles.acoesLinha}>
        {item.status === 'ABERTA' && (
          <Botao titulo="Fechar" onPress={fechar} tamanho="pequeno" variante="secundario" />
        )}
        {item.status === 'FECHADA' && (
          <Botao titulo="Pagar" onPress={pagar} tamanho="pequeno" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    padding: ESPACAMENTOS.medio,
    marginHorizontal: ESPACAMENTOS.medio,
    marginTop: ESPACAMENTOS.medio,
    ...SOMBRAS.pequena,
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.pequeno,
  },
  mesa: {
    fontSize: FONTES.grande,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
  },
  status: {
    fontSize: FONTES.pequena,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cliente: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    marginBottom: ESPACAMENTOS.minimo,
  },
  valor: {
    fontSize: FONTES.media,
    color: CORES.textoEscuro,
    marginTop: ESPACAMENTOS.pequeno,
  },
  dica: {
    marginTop: ESPACAMENTOS.pequeno,
    fontSize: FONTES.pequena,
    color: CORES.textoClaro,
    fontStyle: 'italic',
  },
  acoesLinha: {
    flexDirection: 'row',
    gap: ESPACAMENTOS.pequeno,
    marginTop: ESPACAMENTOS.pequeno,
  },
});

export default ComandaCard;
