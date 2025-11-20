const { ItemComanda, ItemCardapio, Comanda } = require('../models');
const { Op } = require('sequelize');

class ServicoProducao {
  /**
   * Listar pedidos pendentes para Copa ou Cozinha
   * @param {string} setor - 'BEBIDA' para Copa, 'PRATO' para Cozinha
   */
  async listarPedidosPorSetor(setor) {
    if (!['PRATO', 'BEBIDA'].includes(setor)) {
      throw new Error('Setor deve ser PRATO (Cozinha) ou BEBIDA (Copa)');
    }

    const itens = await ItemComanda.findAll({
      include: [
        {
          model: ItemCardapio,
          as: 'item_cardapio',
          where: { tipo: setor }
        },
        {
          model: Comanda,
          as: 'comanda',
          where: { status: 'ABERTA' }
        }
      ],
      where: {
        status_producao: {
          [Op.in]: ['PENDENTE', 'EM_PRODUCAO', 'PRONTO']
        }
      },
      order: [['criado_em', 'ASC']]
    });

    return itens;
  }

  /**
   * Buscar item específico da comanda
   */
  async buscarItemComanda(id) {
    const item = await ItemComanda.findByPk(id, {
      include: [
        {
          model: ItemCardapio,
          as: 'item_cardapio'
        },
        {
          model: Comanda,
          as: 'comanda'
        }
      ]
    });

    if (!item) {
      throw new Error('Item não encontrado');
    }

    return item;
  }

  /**
   * Iniciar produção de um item
   */
  async iniciarProducao(itemComandaId) {
    const item = await this.buscarItemComanda(itemComandaId);

    if (item.status_producao !== 'PENDENTE') {
      throw new Error('Este item já está em produção ou foi finalizado');
    }

    await item.update({
      status_producao: 'EM_PRODUCAO',
      data_producao_iniciada: new Date()
    });

    return await this.buscarItemComanda(itemComandaId);
  }

  /**
   * Marcar item como pronto
   */
  async marcarComoPronto(itemComandaId) {
    const item = await this.buscarItemComanda(itemComandaId);

    if (item.status_producao !== 'EM_PRODUCAO') {
      throw new Error('Este item não está em produção');
    }

    await item.update({
      status_producao: 'PRONTO',
      data_producao_finalizada: new Date()
    });

    return await this.buscarItemComanda(itemComandaId);
  }

  /**
   * Marcar item como entregue (garçom entregou para o cliente)
   */
  async marcarComoEntregue(itemComandaId) {
    const item = await this.buscarItemComanda(itemComandaId);

    if (item.status_producao !== 'PRONTO') {
      throw new Error('Este item ainda não está pronto para ser entregue');
    }

    await item.update({
      status_producao: 'ENTREGUE',
      data_entrega: new Date()
    });

    return await this.buscarItemComanda(itemComandaId);
  }

  /**
   * Atualizar status diretamente (útil para corrigir problemas)
   */
  async atualizarStatus(itemComandaId, novoStatus) {
    const statusValidos = ['PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE'];

    if (!statusValidos.includes(novoStatus)) {
      throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
    }

    const item = await this.buscarItemComanda(itemComandaId);

    await item.update({
      status_producao: novoStatus
    });

    return await this.buscarItemComanda(itemComandaId);
  }

  /**
   * Obter estatísticas de produção
   */
  async obterEstatisticas(setor = null) {
    const includeOnde = {};

    if (setor) {
      if (!['PRATO', 'BEBIDA'].includes(setor)) {
        throw new Error('Setor deve ser PRATO ou BEBIDA');
      }
      includeOnde.tipo = setor;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [pendentes, emProducao, prontos, entregues] = await Promise.all([
      ItemComanda.count({
        where: { status_producao: 'PENDENTE', criado_em: { [Op.gte]: hoje } },
        include: [{ model: ItemCardapio, as: 'item_cardapio', where: includeOnde, attributes: [] }]
      }),
      ItemComanda.count({
        where: { status_producao: 'EM_PRODUCAO', criado_em: { [Op.gte]: hoje } },
        include: [{ model: ItemCardapio, as: 'item_cardapio', where: includeOnde, attributes: [] }]
      }),
      ItemComanda.count({
        where: { status_producao: 'PRONTO', criado_em: { [Op.gte]: hoje } },
        include: [{ model: ItemCardapio, as: 'item_cardapio', where: includeOnde, attributes: [] }]
      }),
      ItemComanda.count({
        where: { status_producao: 'ENTREGUE', criado_em: { [Op.gte]: hoje } },
        include: [{ model: ItemCardapio, as: 'item_cardapio', where: includeOnde, attributes: [] }]
      })
    ]);

    return {
      setor: setor || 'TODOS',
      data: hoje.toISOString().split('T')[0],
      pendentes,
      emProducao,
      prontos,
      entregues,
      total: pendentes + emProducao + prontos + entregues
    };
  }
}

module.exports = new ServicoProducao();

