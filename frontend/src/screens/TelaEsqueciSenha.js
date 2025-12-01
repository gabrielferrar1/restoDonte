import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CORES, FONTES, ESPACAMENTOS, BORDAS, SOMBRAS } from '../constants/tema';
import Input from '../components/Input';
import Botao from '../components/Botao';

export default function TelaEsqueciSenha({ navigation }) {
  const { esqueciMinhaSenha } = useAuth();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const aoPressionarEnviar = async () => {
    if (!email.trim()) {
      setErro('Por favor, informe o seu e-mail.');
      return;
    }
    try {
      setErro('');
      setSucesso('');
      setCarregando(true);
      const resposta = await esqueciMinhaSenha(email);
      setSucesso(resposta.mensagem || 'Instruções de recuperação enviadas para o seu e-mail.');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formContainer}>
        <Text style={estilos.titulo}>Recuperar Senha</Text>
        <Text style={estilos.subtitulo}>
          Informe seu e-mail para enviarmos as instruções de recuperação.
        </Text>

        {sucesso ? (
          <Text style={estilos.sucesso}>{sucesso}</Text>
        ) : (
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            erro={erro}
          />
        )}

        <Botao
          titulo="Enviar"
          onPress={aoPressionarEnviar}
          carregando={carregando}
          larguraCompleta
          estilo={{ marginTop: ESPACAMENTOS.pequeno }}
          desabilitado={!!sucesso}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={estilos.link}>Voltar para login</Text>
      </TouchableOpacity>
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
    marginBottom: ESPACAMENTOS.grande,
  },
  titulo: {
    fontSize: FONTES.destaque,
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
  link: {
    color: CORES.primaria,
    fontSize: FONTES.media,
    textAlign: 'center',
    paddingVertical: ESPACAMENTOS.pequeno,
  },
  sucesso: {
    color: CORES.sucesso,
    fontSize: FONTES.media,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.medio,
  },
});

