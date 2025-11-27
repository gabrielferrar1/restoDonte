import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

// Cria o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Função de login
  const login = async (email, senha) => {
    setIsLoading(true);
    try {
      console.log('Chamando login com:', email);
      const resposta = await api.post('/autenticacao/login', { email, senha });
      console.log('Resposta login:', resposta.data);

      const { dados } = resposta.data || {};
      const { token, usuario } = dados || {};

      if (token && usuario) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(usuario));
        setUserToken(token);
        setUserInfo(usuario);
      } else {
        throw new Error('Resposta de login inválida do servidor.');
      }
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensagem || 'Não foi possível fazer login.');
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
      console.log('Chamando cadastro com:', { nome, email });
      const resposta = await api.post('/autenticacao/registrar', { nome, email, senha });
      console.log('Resposta cadastro:', resposta.data);

      // Após o cadastro, faz o login automaticamente para pegar o token
      await login(email, senha);
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensagem || 'Não foi possível realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para esqueci minha senha
  const esqueciMinhaSenha = async (email) => {
    try {
      setIsLoading(true);
      console.log('Chamando esqueciMinhaSenha com:', email);
      const resposta = await api.post('/autenticacao/esqueci-minha-senha', { email });
      console.log('Resposta esqueciMinhaSenha:', resposta.data);
      return resposta.data;
    } catch (error) {
      console.error('Erro em esqueciMinhaSenha:', error.response?.data || error.message);
      throw new Error(error.response?.data?.mensagem || 'Não foi possível iniciar a recuperação de senha.');
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
