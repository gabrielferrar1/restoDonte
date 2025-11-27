import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function TelaLogin({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@restodonte.com');
  const [senha, setSenha] = useState('admin123');
  const [carregando, setCarregando] = useState(false);

  const aoPressionarEntrar = async () => {
    try {
      setCarregando(true);
      await login(email, senha);
    } catch (erro) {
      Alert.alert('Erro ao entrar', erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>RestôDonte</Text>
      <Text style={estilos.subtitulo}>Controle de comandas para o seu restaurante</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={estilos.entrada}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
        onPress={aoPressionarEntrar}
        disabled={carregando}
      >
        <Text style={estilos.textoBotao}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={estilos.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
        <Text style={estilos.link}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 24,
    textAlign: 'center',
  },
  entrada: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCC80',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  botao: {
    width: '100%',
    height: 48,
    backgroundColor: '#E65100',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#E65100',
    marginTop: 4,
  },
});

