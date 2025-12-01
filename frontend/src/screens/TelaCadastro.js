import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CORES, FONTES, ESPACAMENTOS, BORDAS, SOMBRAS } from '../constants/tema';
import Input from '../components/Input';
import Botao from '../components/Botao';

export default function TelaCadastro({ navigation }) {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  const validar = () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = 'O nome é obrigatório.';
    if (!email.trim()) novosErros.email = 'O e-mail é obrigatório.';
    if (!senha) novosErros.senha = 'A senha é obrigatória.';
    else if (senha.length < 6) novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoPressionarCadastrar = async () => {
    if (!validar()) return;

    try {
      setCarregando(true);
      await cadastrar(nome, email, senha);
      // O AuthContext já lida com o login automático, então o usuário será redirecionado.
      // O Alert foi removido para uma experiência mais fluida.
    } catch (erro) {
      // Se o erro for da API (ex: email já existe), exibe no campo de email.
      if (erro.message.toLowerCase().includes('email')) {
        setErros({ email: erro.message });
      } else {
        setErros({ geral: erro.message });
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={estilos.container}>
        <View style={estilos.formContainer}>
          <Text style={estilos.titulo}>Criar Conta</Text>
          <Text style={estilos.subtitulo}>Junte-se ao RestôDonte</Text>

          {erros.geral && <Text style={estilos.erroGeral}>{erros.geral}</Text>}

          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            erro={erros.nome}
          />

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            erro={erros.email}
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            erro={erros.senha}
          />

          <Input
            label="Confirmar Senha"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            erro={erros.confirmarSenha}
          />

          <Botao
            titulo="Cadastrar"
            onPress={aoPressionarCadastrar}
            carregando={carregando}
            larguraCompleta
            estilo={{ marginTop: ESPACAMENTOS.pequeno }}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.link}>Já tem conta? Voltar para login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  erroGeral: {
    color: CORES.erro,
    fontSize: FONTES.media,
    textAlign: 'center',
    marginBottom: ESPACAMENTOS.medio,
  }
});

