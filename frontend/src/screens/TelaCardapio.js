import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../api/api';
import { CORES, ESPACAMENTOS, FONTES, TIPOS_ITEM } from '../constants/tema';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Botao from '../components/Botao';
import BarraBusca from '../components/BarraBusca';
import FiltroChip from '../components/FiltroChip';

export default function TelaCardapio() {
  const route = useRoute();
  const navigation = useNavigation();
  const comandaId = route.params?.comandaId;

  const [itens, setItens] = useState([]);
  const [itensFiltrados, setItensFiltrados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');

  const carregarItens = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/cardapio');

      const dadosCardapio = Array.isArray(resposta.data) ? resposta.data : (resposta.data?.dados || []);
      setItens(dadosCardapio);
      setItensFiltrados(dadosCardapio);
    } catch (err) {
      console.error('Erro ao carregar cardápio:', err.response?.data || err.message);
      setErro('Não foi possível carregar o cardápio.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarItens();
    }, [carregarItens])
  );

  useEffect(() => {
    let resultado = itens;

    if (filtroTipo !== 'TODOS') {
      resultado = resultado.filter(item => item.tipo === filtroTipo);
    }

    if (busca.trim()) {
      resultado = resultado.filter(item =>
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    setItensFiltrados(resultado);
  }, [filtroTipo, busca, itens]);

  const adicionarItemComanda = async (item) => {
    if (!comandaId) {
      Alert.alert('Erro', 'Comanda não identificada.');
      return;
    }

    let quantidadeSelecionada = 1;

    // Tentar obter quantidade via prompt no web
    try {
      // window.prompt só existe no web
      if (typeof window !== 'undefined' && window.prompt) {
        const entrada = window.prompt(`Quantas unidades de "${item.nome}"?`, '1');
        const qtd = parseInt(entrada, 10);
        if (!isNaN(qtd) && qtd > 0) {
          quantidadeSelecionada = qtd;
        }
      }
    } catch (_) {
      // Ignorar e manter quantidade padrão 1
    }

    try {
      setCarregando(true);
      await api.post(`/comandas/${comandaId}/itens`, {
        item_cardapio_id: item.id,
        quantidade: quantidadeSelecionada,
      });

      Alert.alert(
        'Item adicionado',
        `${quantidadeSelecionada}x ${item.nome} adicionado à comanda.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
    } catch (err) {
      console.error('Erro ao adicionar item:', err.response?.data || err.message);
      Alert.alert('Erro', 'Não foi possível adicionar o item à comanda.');
    } finally {
      setCarregando(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card estilo={estilos.cardItem}>
      <View style={estilos.itemCabecalho}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.itemNome}>{item.nome}</Text>
          {item.descricao && (
            <Text style={estilos.itemDescricao}>{item.descricao}</Text>
          )}
        </View>
        <Badge
          texto={TIPOS_ITEM[item.tipo]?.label || item.tipo}
          cor={TIPOS_ITEM[item.tipo]?.cor || CORES.textoClaro}
        />
      </View>

      <View style={estilos.itemRodape}>
        <View style={estilos.precoContainer}>
          <MaterialIcons name="attach-money" size={20} color={CORES.sucesso} />
          <Text style={estilos.preco}>
            R$ {Number(item.preco).toFixed(2).replace('.', ',')}
          </Text>
        </View>

        {item.tempo_preparo_minutos && (
          <View style={estilos.tempoContainer}>
            <MaterialIcons name="schedule" size={16} color={CORES.textoClaro} />
            <Text style={estilos.tempo}>{item.tempo_preparo_minutos} min</Text>
          </View>
        )}
      </View>

      {comandaId ? (
        <View style={{ marginTop: ESPACAMENTOS.pequeno }}>
          <Botao titulo="Adicionar" onPress={() => adicionarItemComanda(item)} tamanho="pequeno" />
        </View>
      ) : null}

      {!item.ativo && (
        <View style={estilos.inativoOverlay}>
          <Text style={estilos.inativoTexto}>INDISPONÍVEL</Text>
        </View>
      )}
    </Card>
  );

  if (carregando && !itens.length) {
    return (
      <View style={estilos.containerCarregando}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={estilos.carregandoTexto}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={itensFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <>
            <View style={estilos.cabecalho}>
              <Text style={estilos.titulo}>
                {comandaId ? 'Adicionar Item à Comanda' : 'Cardápio'}
              </Text>
              <Text style={estilos.subtitulo}>
                {comandaId
                  ? 'Selecione um item para adicionar'
                  : `${itensFiltrados.length} ${itensFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}`
                }
              </Text>
            </View>
            <BarraBusca
              valor={busca}
              aoMudarTexto={setBusca}
              placeholder="Buscar no cardápio..."
            />
            <View style={estilos.filtrosContainer}>
              <FiltroChip label="Todos" ativo={filtroTipo === 'TODOS'} onPress={() => setFiltroTipo('TODOS')} />
              <FiltroChip label="Pratos" ativo={filtroTipo === 'PRATO'} onPress={() => setFiltroTipo('PRATO')} />
              <FiltroChip label="Bebidas" ativo={filtroTipo === 'BEBIDA'} onPress={() => setFiltroTipo('BEBIDA')} />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={estilos.vazio}>
            <MaterialIcons name="restaurant" size={64} color={CORES.bordaClara} />
            <Text style={estilos.vazioTexto}>
              {erro || (busca ? 'Nenhum item encontrado' : 'Cardápio vazio')}
            </Text>
            {erro && <Botao titulo="Tentar Novamente" onPress={carregarItens} variante="secundario" />}
          </View>
        }
        refreshing={carregando}
        onRefresh={carregarItens}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
  },
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CORES.fundoClaro,
  },
  carregandoTexto: {
    marginTop: ESPACAMENTOS.medio,
    fontSize: FONTES.media,
    color: CORES.textoMedio,
  },
  cabecalho: {
    paddingTop: ESPACAMENTOS.grande,
    paddingHorizontal: ESPACAMENTOS.grande,
  },
  titulo: {
    fontSize: FONTES.tituloGrande,
    fontWeight: 'bold',
    color: CORES.primaria,
  },
  subtitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    marginTop: ESPACAMENTOS.minimo,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: ESPACAMENTOS.grande,
    marginBottom: ESPACAMENTOS.pequeno,
  },
  lista: {
    paddingHorizontal: ESPACAMENTOS.grande,
    paddingBottom: ESPACAMENTOS.grande,
  },
  cardItem: {
    position: 'relative',
    marginTop: ESPACAMENTOS.medio,
  },
  itemCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ESPACAMENTOS.pequeno,
  },
  itemNome: {
    fontSize: FONTES.normal,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    marginBottom: ESPACAMENTOS.minimo,
    flexShrink: 1,
  },
  itemDescricao: {
    fontSize: FONTES.pequena,
    color: CORES.textoMedio,
    lineHeight: 18,
  },
  itemRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ESPACAMENTOS.pequeno,
  },
  precoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preco: {
    fontSize: FONTES.grande,
    fontWeight: 'bold',
    color: CORES.sucesso,
  },
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempo: {
    fontSize: FONTES.pequena,
    color: CORES.textoClaro,
    marginLeft: ESPACAMENTOS.minimo,
  },
  inativoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12, // Deve corresponder ao borderRadius do Card
  },
  inativoTexto: {
    fontSize: FONTES.media,
    fontWeight: 'bold',
    color: CORES.erro,
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ESPACAMENTOS.extraGrande * 2,
  },
  vazioTexto: {
    marginTop: ESPACAMENTOS.medio,
    fontSize: FONTES.normal,
    color: CORES.textoClaro,
  },
});
