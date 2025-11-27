import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import api from '../api/api';

export default function TelaComandas() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abrindoPedido, setAbrindoPedido] = useState(false);

  const carregarPedidos = async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/comandas');
      // backend responde { sucesso, dados: [...] }
      setPedidos(resposta.data.dados || []);
    } catch (erro) {
      console.error('Erro ao carregar pedidos:', erro.response?.data || erro.message);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirNovoPedido = async () => {
    try {
      setAbrindoPedido(true);
      // Exemplo simples: abre pedido para mesa 1 sem cliente nomeado.
      // Em uma próxima etapa, podemos abrir um formulário com número da mesa e nome do cliente.
      await api.post('/comandas', {
        numero_mesa: 1,
        nome_cliente: 'Mesa 1',
      });
      await carregarPedidos();
    } catch (erro) {
      console.error('Erro ao abrir novo pedido:', erro.response?.data || erro.message);
      Alert.alert('Erro', 'Não foi possível abrir um novo pedido.');
    } finally {
      setAbrindoPedido(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  if (carregando) {
    return (
      <View style={estilos.containerCarregando}>
        <ActivityIndicator size="large" color="#E65100" />
      </View>
    );
  }

  const renderizarPedido = ({ item }) => (
    <TouchableOpacity style={estilos.cardPedido}>
      <View style={estilos.linhaTitulo}>
        <Text style={estilos.mesa}>Mesa {item.numero_mesa}</Text>
        <Text style={estilos.status}>{item.status}</Text>
      </View>
      {item.nome_cliente ? (
        <Text style={estilos.cliente}>Cliente: {item.nome_cliente}</Text>
      ) : null}
      <Text style={estilos.valor}>Total: R$ {Number(item.valor_total || 0).toFixed(2)}</Text>
      <Text style={estilos.dica}>Toque para ver os detalhes do pedido.</Text>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Pedidos</Text>
      <Text style={estilos.subtitulo}>
        Acompanhe aqui os pedidos em aberto, fechados e pagos.
      </Text>

      <View style={estilos.linhaTopo}>
        <TouchableOpacity
          style={[estilos.botaoNovoPedido, abrindoPedido && estilos.botaoDesabilitado]}
          onPress={abrirNovoPedido}
          disabled={abrindoPedido}
        >
          <Text style={estilos.textoBotaoNovoPedido}>
            {abrindoPedido ? 'Abrindo pedido...' : 'Abrir novo pedido'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarPedido}
        refreshing={carregando}
        onRefresh={carregarPedidos}
        ListEmptyComponent={
          <Text style={estilos.listaVazia}>Nenhum pedido encontrado.</Text>
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF3E0',
  },
  containerCarregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 12,
  },
  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  botaoNovoPedido: {
    backgroundColor: '#E65100',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textoBotaoNovoPedido: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  cardPedido: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  linhaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mesa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
  },
  cliente: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 2,
  },
  valor: {
    fontSize: 14,
    color: '#4E342E',
    marginBottom: 8,
  },
  dica: {
    marginTop: 6,
    fontSize: 12,
    color: '#8D6E63',
  },
  linhaAcoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  botaoAcao: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botaoDetalhes: {
    backgroundColor: '#FFE0B2',
  },
  botaoAdicionar: {
    backgroundColor: '#E65100',
  },
  textoBotaoAcao: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listaVazia: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6D4C41',
  },
});
