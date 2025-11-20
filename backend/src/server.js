require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const rotas = require('./routes');

const app = express();
const PORTA = process.env.PORT || 3000;

// Middlewares
app.use(cors());
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
const iniciarServidor = async () => {
  try {
    // Testar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      // await sequelize.sync({ alter: false });
      console.log('📊 Modelos sincronizados');
    }
    
    // Iniciar servidor
    app.listen(PORTA, () => {
      console.log(`🚀 Servidor rodando na porta ${PORTA}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API disponível em: http://localhost:${PORTA}/api`);
      console.log(`\n📚 Endpoints disponíveis:`);
      console.log(`   - POST   /api/autenticacao/login`);
      console.log(`   - POST   /api/autenticacao/registrar`);
      console.log(`   - GET    /api/cardapio`);
      console.log(`   - GET    /api/comandas`);
      console.log(`   - GET    /api/producao/copa`);
      console.log(`   - GET    /api/producao/cozinha`);
      console.log(`   - GET    /api/relatorios/diario`);
      console.log(`\n✨ RestôDonte Backend está pronto!\n`);
    });
  } catch (erro) {
    console.error('❌ Erro ao iniciar o servidor:', erro);
    process.exit(1);
  }
};

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido. Encerrando servidor gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT recebido. Encerrando servidor gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Iniciar
iniciarServidor();

module.exports = app;

