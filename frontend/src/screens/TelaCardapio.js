import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/api';

export default function TelaCardapio() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarItens = async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/cardapio');
      setItens(resposta.data.dados || []);
    } catch (erro) {
      console.error(erro);
      Alert.alert('Erro', 'Não foi possível carregar o cardápio.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarItens();
  }, []);

  if (carregando) {
    return (
      <View style={estilos.containerCarregando}>
        <ActivityIndicator size="large" color="#E65100" />
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Cardápio</Text>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={estilos.item}>
            <Text style={estilos.nome}>{item.nome} - R$ {Number(item.preco).toFixed(2)}</Text>
            <Text style={estilos.descricao}>{item.descricao}</Text>
            <Text style={estilos.tipo}>Tipo: {item.tipo === 'PRATO' ? 'Prato' : 'Bebida'}</Text>
          </View>
        )}
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
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  descricao: {
    fontSize: 14,
    color: '#6D4C41',
  },
  tipo: {
    marginTop: 4,
    fontSize: 12,
    color: '#8D6E63',
  },
});

