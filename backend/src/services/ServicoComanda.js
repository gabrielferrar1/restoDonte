const { Comanda, ItemComanda, ItemCardapio } = require('../models');
const { Op } = require('sequelize');
class ServicoComanda {
  async listarTodas(filtros = {}) {
    const onde = {};
    if (filtros.status) {
      onde.status = filtros.status;
    }
    if (filtros.numero_mesa) {
      onde.numero_mesa = filtros.numero_mesa;
    }
    if (filtros.data_inicio && filtros.data_fim) {
      onde.data_abertura = {
        [Op.between]: [filtros.data_inicio, filtros.data_fim]
      };
    }
    const comandas = await Comanda.findAll({
      where: onde,
      include: [{
        model: ItemComanda,
        as: 'itens',
        include: [{
          model: ItemCardapio,
          as: 'item_cardapio'
        }]
      }],
      order: [['data_abertura', 'DESC']]
    });
    return comandas;
  }
  async buscarPorId(id) {
    const comanda = await Comanda.findByPk(id, {
      include: [{
        model: ItemComanda,
        as: 'itens',
        include: [{
          model: ItemCardapio,
          as: 'item_cardapio'
        }]
      }]
    });
    if (!comanda) {
      throw new Error('Comanda não encontrada');
    }
    return comanda;
  }
  async abrir(dados) {
    if (!dados.numero_mesa) {
      throw new Error('Número da mesa é obrigatório');
    }
    const comandaAberta = await Comanda.findOne({
      where: {
        numero_mesa: dados.numero_mesa,
        status: 'ABERTA'
      }
    });
    if (comandaAberta) {
      throw new Error('Já existe uma comanda aberta para esta mesa');
    }
    const comanda = await Comanda.create({
      numero_mesa: dados.numero_mesa,
      nome_cliente: dados.nome_cliente,
      observacoes: dados.observacoes,
      status: 'ABERTA',
      data_abertura: new Date(),
      valor_total: 0
    });
    return comanda;
  }
  async adicionarItem(comandaId, dados) {
    const comanda = await this.buscarPorId(comandaId);
    if (comanda.status !== 'ABERTA') {
      throw new Error('Não é possível adicionar itens em uma comanda fechada');
    }
    if (!dados.item_cardapio_id) {
      throw new Error('Item do cardápio é obrigatório');
    }
    if (!dados.quantidade || dados.quantidade < 1) {
      throw new Error('Quantidade deve ser no mínimo 1');
    }
    const itemCardapio = await ItemCardapio.findByPk(dados.item_cardapio_id);
    if (!itemCardapio) {
      throw new Error('Item do cardápio não encontrado');
    }
    if (!itemCardapio.ativo) {
      throw new Error('Item do cardápio não está disponível');
    }
    const itemComanda = await ItemComanda.create({
      comanda_id: comandaId,
      item_cardapio_id: dados.item_cardapio_id,
      quantidade: dados.quantidade,
      preco_unitario: itemCardapio.preco,
      subtotal: itemCardapio.preco * dados.quantidade,
      observacoes: dados.observacoes,
      status_producao: 'PENDENTE'
    });
    const itemCriado = await ItemComanda.findByPk(itemComanda.id, {
      include: [{
        model: ItemCardapio,
        as: 'item_cardapio'
      }]
    });
    return itemCriado;
  }
  async fecharComanda(comandaId) {
    const comanda = await this.buscarPorId(comandaId);
    if (comanda.status !== 'ABERTA') {
      throw new Error('Comanda já está fechada');
    }
    const itensNaoEntregues = comanda.itens.filter(
      item => item.status_producao !== 'ENTREGUE'
    );
    if (itensNaoEntregues.length > 0) {
      throw new Error('Não é possível fechar a comanda. Existem itens que não foram entregues.');
    }
    await comanda.update({
      status: 'FECHADA',
      data_fechamento: new Date()
    });
    return await this.buscarPorId(comandaId);
  }
  async registrarPagamento(comandaId) {
    const comanda = await this.buscarPorId(comandaId);
    if (comanda.status !== 'FECHADA') {
      throw new Error('A comanda precisa estar fechada para registrar o pagamento');
    }
    await comanda.update({
      status: 'PAGA'
    });
    return await this.buscarPorId(comandaId);
  }
}
module.exports = new ServicoComanda();
