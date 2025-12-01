import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import api from '../api/api';
import { CORES, FONTES, ESPACAMENTOS } from '../constants/tema';
import Botao from '../components/Botao';

export default function TelaDetalhesComanda({ navigation }) {
  const route = useRoute();
  const { comandaId } = route.params;

  const [comanda, setComanda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDetalhes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get(`/comandas/${comandaId}`);

      const dadosComanda = resposta.data?.dados || resposta.data;
      setComanda(dadosComanda);
    } catch (err) {
      console.error('Erro ao carregar detalhes da comanda:', err.response?.data || err.message);
      setErro('Não foi possível carregar os detalhes da comanda.');
    } finally {
      setCarregando(false);
    }
  }, [comandaId]);

  useFocusEffect(
    useCallback(() => {
      carregarDetalhes();
    }, [carregarDetalhes])
  );

  const confirmar = (mensagem, onConfirm) => {
    // Fallback para web
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(mensagem)) onConfirm();
      return;
    }
    // Mobile/Expo
    Alert.alert('Confirmação', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: onConfirm },
    ]);
  };

  const fecharComanda = async () => {
    const msg = `Valor total: R$ ${Number(comanda.valor_total).toFixed(2)}\n\nDeseja fechar esta comanda?`;
    confirmar(msg, async () => {
      try {
        console.log('[Frontend] Fechar comanda acionado', { comandaId });
        setCarregando(true);
        const resp = await api.put(`/comandas/${comandaId}/fechar`);
        console.log('[Frontend] Resposta fechar comanda', resp.status, resp.data);
        await carregarDetalhes();
        Alert.alert('Sucesso', 'Comanda fechada com sucesso!');
      } catch (err) {
        console.error('[Frontend] Erro ao fechar comanda:', err.response?.data || err.message);
        Alert.alert('Erro', err.response?.data?.erro || 'Não foi possível fechar a comanda.');
      } finally {
        setCarregando(false);
      }
    });
  };

  const registrarPagamento = async () => {
    const msg = `Valor total: R$ ${Number(comanda.valor_total).toFixed(2)}\n\nConfirmar pagamento?`;
    confirmar(msg, async () => {
      try {
        console.log('[Frontend] Registrar pagamento acionado', { comandaId });
        setCarregando(true);
        const resp = await api.put(`/comandas/${comandaId}/pagar`);
        console.log('[Frontend] Resposta pagamento', resp.status, resp.data);
        await carregarDetalhes();
        Alert.alert('Sucesso', 'Pagamento registrado com sucesso!');
      } catch (err) {
        console.error('[Frontend] Erro ao registrar pagamento:', err.response?.data || err.message);
        Alert.alert('Erro', err.response?.data?.erro || 'Não foi possível registrar o pagamento.');
      } finally {
        setCarregando(false);
      }
    });
  };

  if (carregando) {
    return (
      <View style={styles.containerCentrado}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.textoFeedback}>Carregando comanda...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.containerCentrado}>
        <Text style={styles.textoFeedback}>{erro}</Text>
        <Botao titulo="Tentar Novamente" onPress={carregarDetalhes} variante="secundario" />
      </View>
    );
  }

  if (!comanda) {
    return (
      <View style={styles.containerCentrado}>
        <Text style={styles.textoFeedback}>Comanda não encontrada.</Text>
      </View>
    );
  }

  const pendentes = Array.isArray(comanda.itens) ? comanda.itens.filter(i => String(i.status_producao).toUpperCase() !== 'ENTREGUE').length : 0;

  const renderItemComanda = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemQuantidade}>{item.quantidade}x</Text>
      <View style={styles.itemDetalhes}>
        <Text style={styles.itemNome}>{item.item_cardapio?.nome || 'Item'}</Text>
        <Text style={styles.itemPrecoUnitario}>
          R$ {Number(item.preco_unitario).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.itemSubtotal}>
        R$ {Number(item.subtotal).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Mesa {comanda.numero_mesa}</Text>
        <Text style={styles.status}>{comanda.status}</Text>
      </View>

      <View style={styles.resumoContainer}>
        <Text style={styles.totalLabel}>Valor Total</Text>
        <Text style={styles.totalValor}>R$ {Number(comanda.valor_total).toFixed(2)}</Text>
      </View>

      {pendentes > 0 && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoTexto}>
            Existem {pendentes} item(ns) ainda não entregues. Fechar só é permitido quando todos forem entregues.
          </Text>
        </View>
      )}

      <View style={styles.botoesAcao}>
        <Botao
          titulo="Adicionar Item"
          onPress={() => navigation.navigate('Cardapio', { comandaId: comanda.id })}
          estilo={{ flex: 1, marginRight: ESPACAMENTOS.pequeno }}
          disabled={String(comanda.status).toUpperCase() !== 'ABERTA'}
        />
        {String(comanda.status).toUpperCase() === 'ABERTA' && (
          <Botao
            titulo="Fechar"
            onPress={fecharComanda}
            variante="secundario"
            estilo={{ flex: 1, marginLeft: ESPACAMENTOS.pequeno }}
            disabled={pendentes > 0}
          />
        )}
        {String(comanda.status).toUpperCase() === 'FECHADA' && (
          <Botao
            titulo="Registrar Pagamento"
            onPress={registrarPagamento}
            estilo={{ flex: 1, marginLeft: ESPACAMENTOS.pequeno }}
          />
        )}
      </View>

      <Text style={styles.tituloItens}>Itens na Comanda</Text>
      <FlatList
        data={comanda.itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItemComanda}
        ListEmptyComponent={<Text style={styles.textoFeedback}>Nenhum item na comanda.</Text>}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
  },
  containerCentrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACAMENTOS.grande,
    gap: ESPACAMENTOS.medio,
  },
  textoFeedback: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
  },
  cabecalho: {
    backgroundColor: CORES.fundoBranco,
    padding: ESPACAMENTOS.grande,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaClara,
    alignItems: 'center',
  },
  titulo: {
    fontSize: FONTES.destaque,
    fontWeight: 'bold',
    color: CORES.primaria,
  },
  status: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    textTransform: 'capitalize',
    marginTop: ESPACAMENTOS.minimo,
  },
  resumoContainer: {
    backgroundColor: CORES.primariaClara,
    padding: ESPACAMENTOS.medio,
    margin: ESPACAMENTOS.grande,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONTES.normal,
    color: CORES.textoBranco,
  },
  totalValor: {
    fontSize: FONTES.hero,
    fontWeight: 'bold',
    color: CORES.textoBranco,
  },
  botoesAcao: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.grande,
  },
  tituloItens: {
    fontSize: FONTES.titulo,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    paddingHorizontal: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.fundoBranco,
    padding: ESPACAMENTOS.medio,
    marginHorizontal: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.pequeno,
    borderRadius: 8,
  },
  itemQuantidade: {
    fontSize: FONTES.media,
    fontWeight: 'bold',
    color: CORES.primaria,
    marginRight: ESPACAMENTOS.medio,
  },
  itemDetalhes: {
    flex: 1,
  },
  itemNome: {
    fontSize: FONTES.normal,
    color: CORES.textoEscuro,
  },
  itemPrecoUnitario: {
    fontSize: FONTES.pequena,
    color: CORES.textoClaro,
  },
  itemSubtotal: {
    fontSize: FONTES.normal,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
  },
  avisoContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    borderWidth: 1,
    marginHorizontal: ESPACAMENTOS.grande,
    padding: ESPACAMENTOS.medio,
    borderRadius: 8,
    marginBottom: ESPACAMENTOS.medio,
  },
  avisoTexto: {
    color: '#856404',
    fontSize: FONTES.pequena,
  },
});
