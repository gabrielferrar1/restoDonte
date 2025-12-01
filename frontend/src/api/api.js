import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, CONFIG } from '../config/ambiente';

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: CONFIG.TIMEOUT,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  try {
    let token = null;
    // Tenta AsyncStorage (mobile) e localStorage (web) sem quebrar a chamada
    try {
      token = await AsyncStorage.getItem('userToken');
    } catch {}
    if (!token && typeof window !== 'undefined') {
      try {
        token = window.localStorage.getItem('userToken');
      } catch {}
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (CONFIG.DEBUG) {
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      console.log('[API] Request:', config.method?.toUpperCase(), fullUrl);
    }
    return config;
  } catch (error) {
    // Não bloquear a requisição em caso de erro ao obter token
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

export default api;
