import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da sua API local
const URL_BASE_API = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: URL_BASE_API,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

