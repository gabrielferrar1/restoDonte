import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../api/api';
import { CORES, FONTES, ESPACAMENTOS } from '../constants/tema';
import Botao from '../components/Botao';
import ComandaCard from '../components/ComandaCard';
import Card from '../components/Card';

export default function TelaComandas() {
  const [comandas, setComandas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  const carregarComandas = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/comandas');

      const dadosComandas = Array.isArray(resposta.data) ? resposta.data : (resposta.data?.dados || []);
      setComandas(dadosComandas);
    } catch (err) {
      console.error('Erro ao carregar comandas:', err.response?.data || err.message);
      setErro('Não foi possível carregar as comandas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarComandas();
    }, [carregarComandas])
  );

  const abrirNovaComanda = async () => {
    try {
      await api.post('/comandas', {
        numero_mesa: Math.floor(Math.random() * 20) + 1,
      });
      await carregarComandas();
    } catch (err) {
      console.error('Erro ao abrir nova comanda:', err.response?.data || err.message);
      setErro(err.response?.data?.erro || 'Não foi possível abrir uma nova comanda.');
    }
  };

  const renderizarComanda = ({ item }) => (
    <ComandaCard
      item={item}
      onPress={() => navigation.navigate('DetalhesComanda', { comandaId: item.id })}
      onActionComplete={carregarComandas}
    />
  );

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.titulo}>Comandas</Text>
          <Text style={estilos.subtitulo}>Gerencie as comandas do restaurante</Text>
        </View>
        <Botao
          titulo="Nova Comanda"
          onPress={abrirNovaComanda}
          tamanho="pequeno"
        />
      </View>

      {carregando && comandas.length === 0 ? (
        <ActivityIndicator size="large" color={CORES.primaria} style={{ marginTop: ESPACAMENTOS.grande }} />
      ) : (
        <FlatList
          data={comandas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderizarComanda}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Card estilo={estilos.listaVaziaContainer}>
              <Text style={estilos.listaVaziaTexto}>
                {erro ? erro : 'Nenhuma comanda encontrada.'}
              </Text>
              {erro ? <Botao titulo="Tentar Novamente" onPress={carregarComandas} variante="secundario" /> : null}
            </Card>
          }
          refreshControl={
            <RefreshControl refreshing={carregando} onRefresh={carregarComandas} tintColor={CORES.primaria} />
          }
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ESPACAMENTOS.grande,
    backgroundColor: CORES.fundoBranco,
    borderBottomWidth: 1,
    borderBottomColor: CORES.bordaClara,
  },
  titulo: {
    fontSize: FONTES.tituloGrande,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
  },
  subtitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
  },
  listaVaziaContainer: {
    marginTop: ESPACAMENTOS.extraGrande,
    alignItems: 'center',
    gap: ESPACAMENTOS.medio,
  },
  listaVaziaTexto: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
  },
});
