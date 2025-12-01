import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { CORES, ESPACAMENTOS, FONTES, BORDAS, STATUS_PRODUCAO } from '../constants/tema';
import Botao from '../components/Botao';

const ABAS = [
  { chave: 'PRATO', label: 'Cozinha' },
  { chave: 'BEBIDA', label: 'Copa' },
];

export default function TelaProducao() {
  const [abaAtiva, setAbaAtiva] = useState('PRATO');
  const [dados, setDados] = useState({ PRATO: [], BEBIDA: [] });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');

      const [cozinha, copa] = await Promise.all([
        api.get('/producao/cozinha'),
        api.get('/producao/copa'),
      ]);

      setDados({
        PRATO: Array.isArray(cozinha.data) ? cozinha.data : (cozinha.data?.dados || []),
        BEBIDA: Array.isArray(copa.data) ? copa.data : (copa.data?.dados || []),
      });
    } catch (err) {
      console.error('Erro ao carregar produção:', err.response?.data || err.message);
      setErro('Não foi possível carregar as filas de produção.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const atualizarStatus = async (itemId, acao) => {
    try {
      setCarregando(true);
      await api.put(`/producao/${itemId}/${acao}`);
      await carregarDados();
    } catch (err) {
      console.error(`Erro ao executar ${acao}:`, err.response?.data || err.message);
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => {
    const statusInfo = STATUS_PRODUCAO[item.status_producao];

    return (
      <View style={estilos.cardItem}>
        <View style={estilos.linhaTitulo}>
          <Text style={estilos.mesa}>Mesa {item.comanda.numero_mesa}</Text>
          <Text style={[estilos.badgeStatus, { backgroundColor: statusInfo?.cor || CORES.bordaClara }]}>
            {statusInfo?.label || item.status_producao}
          </Text>
        </View>
        <Text style={estilos.itemNome}>{item.item_cardapio.nome}</Text>
        <Text style={estilos.info}>Quantidade: {item.quantidade}</Text>
        <Text style={estilos.info}>Pedido aberto em: {new Date(item.criado_em).toLocaleTimeString()}</Text>

        <View style={estilos.acoesLinha}>
          {item.status_producao === 'PENDENTE' && (
            <Botao titulo="Iniciar" onPress={() => atualizarStatus(item.id, 'iniciar')} tamanho="pequeno" />
          )}
          {item.status_producao === 'EM_PRODUCAO' && (
            <Botao titulo="Marcar Pronto" onPress={() => atualizarStatus(item.id, 'pronto')} tamanho="pequeno" />
          )}
          {item.status_producao === 'PRONTO' && (
            <Botao titulo="Entregar" onPress={() => atualizarStatus(item.id, 'entregar')} tamanho="pequeno" />
          )}
        </View>
      </View>
    );
  };

  const conteudoAba = dados[abaAtiva] || [];

  return (
    <View style={estilos.container}>
      <View style={estilos.abasContainer}>
        {ABAS.map((aba) => (
          <TouchableOpacity
            key={aba.chave}
            style={[estilos.aba, abaAtiva === aba.chave && estilos.abaAtiva]}
            onPress={() => setAbaAtiva(aba.chave)}
          >
            <Text style={[estilos.abaTexto, abaAtiva === aba.chave && estilos.abaTextoAtivo]}>
              {aba.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {erro ? (
        <View style={estilos.estadoContainer}>
          <Text style={estilos.estadoTexto}>{erro}</Text>
          <Botao titulo="Tentar novamente" onPress={carregarDados} variante="secundario" />
        </View>
      ) : carregando && conteudoAba.length === 0 ? (
        <View style={estilos.estadoContainer}>
          <ActivityIndicator size="large" color={CORES.primaria} />
          <Text style={estilos.estadoTexto}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={conteudoAba}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={conteudoAba.length === 0 && estilos.listaVazia}
          ListEmptyComponent={
            <Text style={estilos.estadoTexto}>Nenhum item nesta fila.</Text>
          }
          refreshing={carregando}
          onRefresh={carregarDados}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
    padding: ESPACAMENTOS.medio,
  },
  abasContainer: {
    flexDirection: 'row',
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    marginBottom: ESPACAMENTOS.medio,
  },
  aba: {
    flex: 1,
    paddingVertical: ESPACAMENTOS.medio,
    alignItems: 'center',
    borderRadius: BORDAS.medio,
  },
  abaAtiva: {
    backgroundColor: CORES.primaria,
  },
  abaTexto: {
    color: CORES.textoMedio,
    fontSize: FONTES.media,
    fontWeight: 'bold',
  },
  abaTextoAtivo: {
    color: CORES.textoBranco,
  },
  estadoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTOS.medio,
  },
  estadoTexto: {
    color: CORES.textoMedio,
    fontSize: FONTES.media,
  },
  cardItem: {
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    padding: ESPACAMENTOS.medio,
    marginBottom: ESPACAMENTOS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
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
  badgeStatus: {
    paddingHorizontal: ESPACAMENTOS.pequeno,
    paddingVertical: 4,
    borderRadius: BORDAS.medio,
    color: CORES.textoBranco,
    fontSize: FONTES.pequena,
    fontWeight: 'bold',
  },
  itemNome: {
    fontSize: FONTES.normal,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    marginBottom: ESPACAMENTOS.minimo,
  },
  info: {
    color: CORES.textoMedio,
    fontSize: FONTES.pequena,
  },
  acoesLinha: {
    flexDirection: 'row',
    gap: ESPACAMENTOS.pequeno,
    marginTop: ESPACAMENTOS.medio,
  },
  listaVazia: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
