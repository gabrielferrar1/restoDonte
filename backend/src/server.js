require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const rotas = require('./routes');

const app = express();
const PORTA = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Configurar CORS: aceitar FRONTEND_URL em produção ou todas as origens em desenvolvimento
const origemFrontend = process.env.FRONTEND_URL || '*';
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: origemFrontend }
  : { origin: true };

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rotas
app.use('/api', rotas);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Bem-vindo à API RestôDonte!',
    versao: '1.0.0',
    documentacao: '/api'
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// Tratamento de erros global
app.use((erro, req, res, next) => {
  console.error('Erro:', erro);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV !== 'production' ? erro.message : undefined
  });
});

// Iniciar servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');

    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: false });
      console.log('Modelos sincronizados');
    }

    app.listen(PORTA, HOST, () => {
      const publicHost = process.env.INSTANCE_PUBLIC_IP || HOST;
      console.log(`Servidor rodando em http://${publicHost}:${PORTA}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('Endpoints principais:');
      console.log('  - POST   /api/autenticacao/login');
      console.log('  - POST   /api/autenticacao/registrar');
      console.log('  - GET    /api/cardapio');
      console.log('  - GET    /api/comandas');
      console.log('  - GET    /api/producao/copa');
      console.log('  - GET    /api/producao/cozinha');
      console.log('  - GET    /api/relatorios/diario');
    });
  })
  .catch(erro => {
    console.error('Erro ao iniciar o servidor:', erro);
    process.exit(1);
  });

module.exports = app;
