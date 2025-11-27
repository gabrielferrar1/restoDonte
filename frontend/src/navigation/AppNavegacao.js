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
        name="Cardápio"
        component={TelaCardapio}
        options={{ title: 'Cardápio' }}
      />
      <Stack.Screen
        name="Pedidos"
        component={TelaComandas}
        options={{ title: 'Pedidos' }}
      />
      <Stack.Screen
        name="Produção"
        component={TelaProducao}
        options={{ title: 'Produção - Copa e Cozinha' }}
      />
      <Stack.Screen
        name="Relatório"
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
