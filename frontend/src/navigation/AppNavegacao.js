import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import TelaLogin from '../screens/TelaLogin';
import TelaCadastro from '../screens/TelaCadastro';
import TelaEsqueciSenha from '../screens/TelaEsqueciSenha';
import TelaHome from '../screens/TelaHome';
import TelaCardapio from '../screens/TelaCardapio';
import TelaComandas from '../screens/TelaComandas';
import TelaProducao from '../screens/TelaProducao';
import TelaRelatorio from '../screens/TelaRelatorio';
import TelaDetalhesComanda from '../screens/TelaDetalhesComanda';

const Stack = createNativeStackNavigator();

function NavegacaoAutenticacao() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={TelaLogin}
        options={{ title: 'Entrar no RestôDonte' }}
      />
      <Stack.Screen
        name="Cadastro"
        component={TelaCadastro}
        options={{ title: 'Cadastrar usuário' }}
      />
      <Stack.Screen
        name="EsqueciSenha"
        component={TelaEsqueciSenha}
        options={{ title: 'Recuperar senha' }}
      />
    </Stack.Navigator>
  );
}

function NavegacaoPrincipal() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Painel"
        component={TelaHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cardapio"
        component={TelaCardapio}
        options={{ title: 'Cardápio' }}
      />
      <Stack.Screen
        name="Comandas"
        component={TelaComandas}
        options={{ title: 'Comandas' }}
      />
      <Stack.Screen
        name="DetalhesComanda"
        component={TelaDetalhesComanda}
        options={({ route }) => ({ title: `Comanda #${route.params?.comandaId}` })}
      />
      <Stack.Screen
        name="Producao"
        component={TelaProducao}
        options={{ title: 'Produção - Copa e Cozinha' }}
      />
      <Stack.Screen
        name="Relatorio"
        component={TelaRelatorio}
        options={{ title: 'Relatório diário' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavegacao() {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E65100" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <NavegacaoPrincipal /> : <NavegacaoAutenticacao />}
    </NavigationContainer>
  );
}
