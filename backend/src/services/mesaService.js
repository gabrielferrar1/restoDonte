const { Mesa } = require('../models');

const mesaService = {
  /**
   * Lista todas as mesas
   * @param {Object} filtros - Filtros opcionais (status)
   * @returns {Promise<Array>} Lista de mesas
   */
  listar: async (filtros = {}) => {
    const where = {};
    
    if (filtros.status) {
      where.status = filtros.status;
    }
    
    return await Mesa.findAll({
      where,
      order: [['numero', 'ASC']]
    });
  },

  /**
   * Busca uma mesa por ID
   * @param {number} id - ID da mesa
   * @returns {Promise<Object>} Mesa encontrada
   * @throws {Error} Se a mesa não for encontrada
   */
  buscarPorId: async (id) => {
    const mesa = await Mesa.findByPk(id);
    
    if (!mesa) {
      throw new Error('Mesa não encontrada');
    }
    
    return mesa;
  },

  /**
   * Busca uma mesa por número
   * @param {number} numero - Número da mesa
   * @returns {Promise<Object>} Mesa encontrada
   * @throws {Error} Se a mesa não for encontrada
   */
  buscarPorNumero: async (numero) => {
    const mesa = await Mesa.findOne({ where: { numero } });
    
    if (!mesa) {
      throw new Error('Mesa não encontrada');
    }
    
    return mesa;
  },

  /**
   * Cria uma nova mesa
   * @param {Object} dados - Dados da mesa (numero, capacidade, status)
   * @returns {Promise<Object>} Mesa criada
   * @throws {Error} Se o número da mesa já existir
   */
  criar: async (dados) => {
    // Valida se o número da mesa já existe
    const mesaExistente = await Mesa.findOne({ 
      where: { numero: dados.numero } 
    });
    
    if (mesaExistente) {
      throw new Error('Já existe uma mesa com este número');
    }
    
    return await Mesa.create(dados);
  },

  /**
   * Atualiza uma mesa existente
   * @param {number} id - ID da mesa
   * @param {Object} dados - Dados para atualizar
   * @returns {Promise<Object>} Mesa atualizada
   * @throws {Error} Se a mesa não for encontrada ou número já existir
   */
  atualizar: async (id, dados) => {
    const mesa = await mesaService.buscarPorId(id);
    
    // Valida se o novo número já existe em outra mesa
    if (dados.numero && dados.numero !== mesa.numero) {
      const mesaExistente = await Mesa.findOne({ 
        where: { numero: dados.numero } 
      });
      
      if (mesaExistente) {
        throw new Error('Já existe uma mesa com este número');
      }
    }
    
    return await mesa.update(dados);
  },

  /**
   * Altera o status de uma mesa
   * @param {number} id - ID da mesa
   * @param {string} novoStatus - Novo status (livre, ocupada, reservada)
   * @returns {Promise<Object>} Mesa atualizada
   * @throws {Error} Se a mesa não for encontrada ou status inválido
   */
  alterarStatus: async (id, novoStatus) => {
    const statusValidos = ['livre', 'ocupada', 'reservada'];
    
    if (!statusValidos.includes(novoStatus)) {
      throw new Error('Status inválido. Use: livre, ocupada ou reservada');
    }
    
    const mesa = await mesaService.buscarPorId(id);
    return await mesa.update({ status: novoStatus });
  },

  /**
   * Remove uma mesa
   * @param {number} id - ID da mesa
   * @returns {Promise<Object>} Mensagem de sucesso
   * @throws {Error} Se a mesa não for encontrada ou estiver ocupada
   */
  deletar: async (id) => {
    const mesa = await mesaService.buscarPorId(id);
    
    if (mesa.status === 'ocupada') {
      throw new Error('Não é possível deletar uma mesa ocupada');
    }
    
    await mesa.destroy();
    return { message: 'Mesa deletada com sucesso' };
  }
};

module.exports = mesaService;
