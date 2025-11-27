import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function TelaCadastro({ navigation }) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const aoPressionarCadastrar = async () => {
    try {
      setCarregando(true);
      await cadastrar(nome, email, senha);
      Alert.alert('Sucesso', 'Usuário cadastrado e autenticado com sucesso!');
    } catch (erro) {
      Alert.alert('Erro no cadastro', erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Criar conta</Text>

      <TextInput
        style={estilos.entrada}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

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
        onPress={aoPressionarCadastrar}
        disabled={carregando}
      >
        <Text style={estilos.textoBotao}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={estilos.link}>Já tem conta? Voltar para login</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 24,
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

