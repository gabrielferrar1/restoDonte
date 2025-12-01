import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/api';
import { CORES, ESPACAMENTOS, FONTES, BORDAS } from '../constants/tema';
import Botao from '../components/Botao';

const CardResumo = ({ titulo, valor, destaque = false }) => (
  <View style={[styles.cardResumo, destaque && styles.cardResumoDestaque]}>
    <Text style={[styles.cardTitulo, destaque && styles.cardTituloClaro]}>{titulo}</Text>
    <Text style={[styles.cardValor, destaque && styles.cardValorClaro]}>{valor}</Text>
  </View>
);

export default function TelaRelatorio() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarRelatorio = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const resposta = await api.get('/relatorios/diario');
      const dadosRelatorio = resposta.data?.dados || resposta.data;
      setDados(dadosRelatorio);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err.response?.data || err.message);
      setErro('Não foi possível carregar o relatório diário.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarRelatorio();
    }, [carregarRelatorio])
  );

  if (carregando && !dados) {
    return (
      <View style={styles.estadoContainer}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.estadoTexto}>Gerando relatório...</Text>
      </View>
    );
  }
  if (erro) {
    return (
      <View style={styles.estadoContainer}>
        <Text style={styles.estadoTexto}>{erro}</Text>
        <Botao titulo="Tentar novamente" onPress={carregarRelatorio} variante="secundario" />
      </View>
    );
  }
  const dataLabel = dados?.data || 'Hoje';
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Relatório de Vendas - {dataLabel}</Text>
      <Text style={styles.subtitulo}>Resumo diário das comandas e itens vendidos.</Text>
      <View style={styles.resumoGrid}>
        <CardResumo titulo="Total vendido" valor={`R$ ${(dados?.total_vendas || 0).toFixed(2)}`} destaque />
        <CardResumo titulo="Comandas fechadas" valor={dados?.comandas_fechadas || 0} />
        <CardResumo titulo="Itens vendidos" valor={dados?.itens_vendidos || 0} />
        <CardResumo titulo="Ticket médio" valor={`R$ ${(dados?.ticket_medio || 0).toFixed(2)}`} />
      </View>
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Itens mais vendidos</Text>
        {(!dados?.itens_populares || dados.itens_populares.length === 0) ? (
          <Text style={styles.estadoTexto}>Nenhum item vendido ainda hoje.</Text>
        ) : (
          <FlatList
            data={dados.itens_populares}
            keyExtractor={(item, index) => `${item.id || index}`}
            renderItem={({ item }) => (
              <View style={styles.itemPopular}>
                <View>
                  <Text style={styles.itemPopularNome}>{item.nome}</Text>
                  <Text style={styles.itemPopularTipo}>{item.tipo === 'PRATO' ? 'Cozinha' : 'Copa'}</Text>
                </View>
                <Text style={styles.itemPopularQtd}>{item.quantidade}x</Text>
              </View>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
          />
        )}
      </View>
      <Botao titulo="Atualizar" onPress={carregarRelatorio} variante="secundario" larguraCompleta estilo={{ marginTop: ESPACAMENTOS.grande }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
  },
  conteudo: {
    padding: ESPACAMENTOS.grande,
  },
  titulo: {
    fontSize: FONTES.tituloGrande,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
  },
  subtitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    marginBottom: ESPACAMENTOS.grande,
  },
  resumoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTOS.medio,
  },
  cardResumo: {
    flexBasis: '48%',
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    padding: ESPACAMENTOS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
  },
  cardResumoDestaque: {
    backgroundColor: CORES.primaria,
    borderColor: CORES.primaria,
  },
  cardTitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
  },
  cardTituloClaro: {
    color: CORES.textoBranco,
  },
  cardValor: {
    fontSize: FONTES.destaque,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
  },
  cardValorClaro: {
    color: CORES.textoBranco,
  },
  secao: {
    marginTop: ESPACAMENTOS.grande,
    backgroundColor: CORES.fundoBranco,
    borderRadius: BORDAS.medio,
    padding: ESPACAMENTOS.medio,
    borderWidth: 1,
    borderColor: CORES.bordaClara,
  },
  secaoTitulo: {
    fontSize: FONTES.titulo,
    fontWeight: 'bold',
    color: CORES.textoEscuro,
    marginBottom: ESPACAMENTOS.medio,
  },
  itemPopular: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ESPACAMENTOS.pequeno,
  },
  itemPopularNome: {
    fontSize: FONTES.normal,
    color: CORES.textoEscuro,
    fontWeight: 'bold',
  },
  itemPopularTipo: {
    fontSize: FONTES.pequena,
    color: CORES.textoMedio,
  },
  itemPopularQtd: {
    fontSize: FONTES.grande,
    fontWeight: 'bold',
    color: CORES.primaria,
  },
  separador: {
    height: 1,
    backgroundColor: CORES.bordaClara,
  },
  estadoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACAMENTOS.grande,
    gap: ESPACAMENTOS.medio,
  },
  estadoTexto: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    textAlign: 'center',
  },
});
