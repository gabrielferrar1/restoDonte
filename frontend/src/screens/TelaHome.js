import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { CORES, ESPACAMENTOS, FONTES, BORDAS } from '../constants/tema';
import Botao from '../components/Botao';
import MenuCard from '../components/MenuCard';

export default function TelaHome({ navigation }) {
  const { userInfo, logout } = useAuth();

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>RestôDonte</Text>
        <Text style={estilos.subtitulo}>Sistema de Gestão de Restaurante</Text>
        {userInfo && (
          <View style={estilos.usuarioContainer}>
            <MaterialIcons name="person" size={16} color={CORES.textoMedio} />
            <Text style={estilos.usuarioTexto}>
              {userInfo.nome} • {userInfo.email}
            </Text>
          </View>
        )}
      </View>

      <View style={estilos.gridMenu}>
        <MenuCard
          titulo="Cardápio"
          descricao="Gerencie pratos e bebidas"
          icone="restaurant-menu"
          cor={CORES.primaria}
          onPress={() => navigation.navigate('Cardapio')}
        />
        <MenuCard
          titulo="Pedidos"
          descricao="Comandas e mesas"
          icone="receipt-long"
          cor={CORES.info}
          onPress={() => navigation.navigate('Comandas')}
        />
        <MenuCard
          titulo="Produção"
          descricao="Copa e Cozinha"
          icone="kitchen"
          cor={CORES.sucesso}
          onPress={() => navigation.navigate('Producao')}
        />
        <MenuCard
          titulo="Relatórios"
          descricao="Vendas e estatísticas"
          icone="assessment"
          cor={CORES.alerta}
          onPress={() => navigation.navigate('Relatorio')}
        />
      </View>

      <Botao
        titulo="Sair"
        onPress={logout}
        variante="secundario"
        larguraCompleta
        estilo={estilos.botaoSair}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
  },
  conteudo: {
    padding: ESPACAMENTOS.grande,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: ESPACAMENTOS.grande,
  },
  titulo: {
    fontSize: FONTES.hero,
    fontWeight: 'bold',
    color: CORES.primaria,
    marginBottom: ESPACAMENTOS.minimo,
  },
  subtitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    marginBottom: ESPACAMENTOS.medio,
    textAlign: 'center',
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.fundoBranco,
    paddingHorizontal: ESPACAMENTOS.medio,
    paddingVertical: ESPACAMENTOS.pequeno,
    borderRadius: BORDAS.circular,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
  },
  usuarioTexto: {
    fontSize: FONTES.pequena,
    color: CORES.textoMedio,
    marginLeft: ESPACAMENTOS.minimo,
  },
  gridMenu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: ESPACAMENTOS.grande,
  },
  botaoSair: {
    marginTop: ESPACAMENTOS.medio,
  },
});
