import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

// Cria o contexto de autenticação
export const AuthContext = createContext();
const extrairDadosOuErro = (resposta, padrao) => {
  const { sucesso, dados, mensagem } = resposta?.data || {};
  if (!sucesso) {
    throw new Error(mensagem || padrao);
  }
  return dados;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Função de login
  const login = async (email, senha) => {
    setIsLoading(true);
    try {
      console.log('=== INICIANDO LOGIN ===');
      console.log('Email:', email);
      console.log('URL da API:', api.defaults.baseURL);
      console.log('Endpoint completo:', `${api.defaults.baseURL}/autenticacao/login`);

      const resposta = await api.post('/autenticacao/login', { email, senha });

      console.log('Resposta recebida:', resposta.data);

      const dados = extrairDadosOuErro(resposta, 'Não foi possível fazer login.');
      const { token, usuario } = dados || {};

      if (!token || !usuario) {
        throw new Error('Resposta de login inválida do servidor.');
      }

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(usuario));
      setUserToken(token);
      setUserInfo(usuario);

      console.log('Login realizado com sucesso!');
    } catch (erro) {
      console.error('=== ERRO NO LOGIN ===');
      console.error('Tipo de erro:', erro.name);
      console.error('Mensagem:', erro.message);
      console.error('Resposta do servidor:', erro.response?.data);
      console.error('Status HTTP:', erro.response?.status);
      console.error('Erro completo:', erro);

      throw new Error(erro.response?.data?.mensagem || erro.message || 'Não foi possível fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoading(false);
  };

  // Função de cadastro de novo usuário
  const cadastrar = async (nome, email, senha) => {
    setIsLoading(true);
    try {
      console.log('=== INICIANDO CADASTRO ===');
      console.log('Dados:', { nome, email });
      console.log('URL da API:', api.defaults.baseURL);

      const resposta = await api.post('/autenticacao/registrar', { nome, email, senha });

      console.log('Resposta do cadastro:', resposta.data);

      extrairDadosOuErro(resposta, 'Não foi possível realizar o cadastro.');

      console.log('Cadastro realizado, fazendo login automático...');
      await login(email, senha);
    } catch (erro) {
      console.error('=== ERRO NO CADASTRO ===');
      console.error('Mensagem:', erro.message);
      console.error('Resposta do servidor:', erro.response?.data);
      console.error('Status HTTP:', erro.response?.status);

      throw new Error(erro.response?.data?.mensagem || erro.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para esqueci minha senha
  const esqueciMinhaSenha = async (email) => {
    setIsLoading(true);
    try {
      console.log('Chamando esqueciMinhaSenha com:', email);
      const resposta = await api.post('/autenticacao/esqueci-minha-senha', { email });
      return extrairDadosOuErro(resposta, 'Não foi possível iniciar a recuperação de senha.');
    } catch (erro) {
      throw new Error(erro.message || 'Não foi possível iniciar a recuperação de senha.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para verificar se o usuário já está logado ao abrir o app
  const isUsuarioLogado = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const info = await AsyncStorage.getItem('userInfo');

      if (token && info) {
        setUserToken(token);
        setUserInfo(JSON.parse(info));
      }
    } catch (error) {
      console.error('Erro ao verificar usuário logado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isUsuarioLogado();
  }, []);

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      cadastrar,
      esqueciMinhaSenha,
      isLoading,
      userToken,
      userInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
