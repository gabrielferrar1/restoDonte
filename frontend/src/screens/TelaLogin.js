import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CORES, FONTES, ESPACAMENTOS, BORDAS, SOMBRAS } from '../constants/tema';
import Input from '../components/Input';
import Botao from '../components/Botao';

export default function TelaLogin({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@restodonte.com');
  const [senha, setSenha] = useState('admin123');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const aoPressionarEntrar = async () => {
    if (!email || !senha) {
      setErro('Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      setErro('');
      setCarregando(true);
      await login(email, senha);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formContainer}>
        <Text style={estilos.titulo}>RestôDonte</Text>
        <Text style={estilos.subtitulo}>Bem-vindo de volta!</Text>

        <Input
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          erro={erro}
        />

        <Input
          label="Senha"
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          erro={erro}
        />

        <Botao
          titulo="Entrar"
          onPress={aoPressionarEntrar}
          carregando={carregando}
          larguraCompleta
          estilo={{ marginTop: ESPACAMENTOS.pequeno }}
        />
      </View>

      <View style={estilos.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={estilos.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenha')}>
          <Text style={estilos.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoClaro,
    justifyContent: 'center',
    padding: ESPACAMENTOS.grande,
  },
  formContainer: {
    backgroundColor: CORES.fundoBranco,
    padding: ESPACAMENTOS.grande,
    borderRadius: BORDAS.grande,
    ...SOMBRAS.media,
  },
  titulo: {
    fontSize: FONTES.hero,
    fontWeight: 'bold',
    color: CORES.primaria,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.pequeno,
  },
  subtitulo: {
    fontSize: FONTES.media,
    color: CORES.textoMedio,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.grande,
  },
  linksContainer: {
    marginTop: ESPACAMENTOS.grande,
    alignItems: 'center',
  },
  link: {
    color: CORES.primaria,
    fontSize: FONTES.media,
    paddingVertical: ESPACAMENTOS.pequeno,
  },
});



