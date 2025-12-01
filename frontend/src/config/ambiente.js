// Configuração de ambiente do frontend
// Altere aqui para mudar entre local e produção

export const CONFIG = {
  // Ambiente atual: 'local' ou 'production'
  AMBIENTE: process.env.EXPO_PUBLIC_ENV || 'local',

  // URLs da API
  API_URL: {
    local: 'http://localhost:3333/api',
    emulador: 'http://10.0.2.2:3333/api',
    production: process.env.EXPO_PUBLIC_API_URL || 'https://sua-api.com/api',
  },

  // Timeout para requisições (ms)
  TIMEOUT: 30000,

  // Habilitar logs de debug
  DEBUG: true,
};

// Exporta a URL correta baseada no ambiente
export const getApiUrl = () => CONFIG.API_URL[CONFIG.AMBIENTE] || CONFIG.API_URL.local;
