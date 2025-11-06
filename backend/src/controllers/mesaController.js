const mesaService = require('../services/mesaService');

const mesaController = {
  /**
   * GET /api/mesas
   * Lista todas as mesas, com filtro opcional por status
   */
  listar: async (req, res) => {
    try {
      const { status } = req.query;
      const mesas = await mesaService.listar({ status });
      
      res.json({
        success: true,
        data: mesas,
        count: mesas.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar mesas',
        message: error.message
      });
    }
  },

  /**
   * GET /api/mesas/:id
   * Busca uma mesa específica por ID
   */
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const mesa = await mesaService.buscarPorId(id);
      
      res.json({
        success: true,
        data: mesa
      });
    } catch (error) {
      const statusCode = error.message === 'Mesa não encontrada' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * POST /api/mesas
   * Cria uma nova mesa
   */
  criar: async (req, res) => {
    try {
      const mesa = await mesaService.criar(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Mesa criada com sucesso',
        data: mesa
      });
    } catch (error) {
      const statusCode = error.message.includes('já existe') ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        error: 'Erro ao criar mesa',
        message: error.message
      });
    }
  },

  /**
   * PUT /api/mesas/:id
   * Atualiza uma mesa existente
   */
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const mesa = await mesaService.atualizar(id, req.body);
      
      res.json({
        success: true,
        message: 'Mesa atualizada com sucesso',
        data: mesa
      });
    } catch (error) {
      let statusCode = 400;
      if (error.message === 'Mesa não encontrada') {
        statusCode = 404;
      } else if (error.message.includes('já existe')) {
        statusCode = 409;
      }
      
      res.status(statusCode).json({
        success: false,
        error: 'Erro ao atualizar mesa',
        message: error.message
      });
    }
  },

  /**
   * PATCH /api/mesas/:id/status
   * Altera o status de uma mesa
   */
  alterarStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'O campo status é obrigatório'
        });
      }
      
      const mesa = await mesaService.alterarStatus(id, status);
      
      res.json({
        success: true,
        message: 'Status da mesa atualizado com sucesso',
        data: mesa
      });
    } catch (error) {
      const statusCode = error.message === 'Mesa não encontrada' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: 'Erro ao alterar status',
        message: error.message
      });
    }
  },

  /**
   * DELETE /api/mesas/:id
   * Remove uma mesa
   */
  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await mesaService.deletar(id);
      
      res.json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      const statusCode = error.message === 'Mesa não encontrada' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: 'Erro ao deletar mesa',
        message: error.message
      });
    }
  }
};

module.exports = mesaController;
