require('dotenv').config();
const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'RestôDonte API está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API RestôDonte',
        version: '1.0.0',
        endpoints: {
            health: '/health'
        }
    });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        path: req.path
    });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Inicializa o servidor e testa a conexão com o banco
const startServer = async () => {
    try {
        // Testa a conexão com o banco de dados
        await db.sequelize.authenticate();
        console.log('✓ Conexão com o banco de dados estabelecida com sucesso.');

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`✓ Servidor rodando na porta ${PORT}`);
            console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`✓ Health check disponível em: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('✗ Não foi possível conectar ao banco de dados:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
