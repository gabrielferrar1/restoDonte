import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function TelaEsqueciSenha({ navigation }) {
  const { esqueciMinhaSenha } = useAuth();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const aoPressionarEnviar = async () => {
    try {
      setCarregando(true);
      await esqueciMinhaSenha(email);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Esqueci minha senha</Text>
      <Text style={estilos.subtitulo}>
        Informe o e-mail cadastrado para receber as instruções de recuperação de senha.
      </Text>

      <TextInput
        style={estilos.entrada}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[estilos.botao, carregando && estilos.botaoDesabilitado]}
        onPress={aoPressionarEnviar}
        disabled={carregando}
      >
        <Text style={estilos.textoBotao}>{carregando ? 'Enviando...' : 'Enviar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={estilos.link}>Voltar para login</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 12,
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

