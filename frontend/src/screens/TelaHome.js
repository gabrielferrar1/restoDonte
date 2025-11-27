import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function TelaHome({ navigation }) {
  const { userInfo, logout } = useAuth();

  const MenuCard = ({ titulo, descricao, onPress }) => (
    <TouchableOpacity style={estilos.cardMenu} onPress={onPress}>
      <Text style={estilos.cardIcone}>🍽️</Text>
      <Text style={estilos.cardTitulo}>{titulo}</Text>
      <Text style={estilos.cardDescricao}>{descricao}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Painel RestôDonte</Text>
      <Text style={estilos.subtitulo}>Escolha uma área para começar a trabalhar.</Text>

      {userInfo && (
        <Text style={estilos.usuario}>Usuário logado: {userInfo.nome} ({userInfo.email})</Text>
      )}

      <View style={estilos.gridMenu}>
        <MenuCard
          titulo="Cardápio"
          descricao="Itens de pratos e bebidas."
          onPress={() => navigation.navigate('Cardápio')}
        />
        <MenuCard
          titulo="Pedidos"
          descricao="Abertura e acompanhamento de pedidos."
          onPress={() => navigation.navigate('Pedidos')}
        />
        <MenuCard
          titulo="Produção"
          descricao="Fila de preparo na Copa e Cozinha."
          onPress={() => navigation.navigate('Produção')}
        />
        <MenuCard
          titulo="Relatório"
          descricao="Resumo das vendas do dia."
          onPress={() => navigation.navigate('Relatório')}
        />
      </View>

      <TouchableOpacity style={estilos.botaoSair} onPress={logout}>
        <Text style={estilos.textoBotaoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 12,
    textAlign: 'center',
  },
  usuario: {
    fontSize: 13,
    color: '#4E342E',
    marginBottom: 16,
    textAlign: 'center',
  },
  gridMenu: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  cardMenu: {
    width: '47%',
    aspectRatio: 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCC80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcone: {
    fontSize: 22,
    marginBottom: 4,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardDescricao: {
    fontSize: 10,
    color: '#6D4C41',
    textAlign: 'center',
  },
  botaoSair: {
    alignSelf: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#BF360C',
  },
  textoBotaoSair: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
