const express = require('express');
const router = express.Router();

// Importa as rotas de cada recurso
const mesaRoutes = require('./mesaRoutes');

// Define as rotas base para cada recurso
router.use('/mesas', mesaRoutes);

// Rota de boas-vindas da API
router.get('/', (req, res) => {
  res.json({
    message: 'API RestôDonte',
    version: '1.0.0',
    endpoints: {
      mesas: '/api/mesas'
    }
  });
});

module.exports = router;
