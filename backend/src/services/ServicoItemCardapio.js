const { ItemCardapio } = require('../models');
const { Op } = require('sequelize');
class ServicoItemCardapio {
  async listarTodos(filtros = {}) {
    const onde = {};
    if (filtros.tipo) {
      onde.tipo = filtros.tipo;
    }
    if (filtros.ativo !== false) {
      onde.ativo = true;
    }
    if (filtros.nome) {
      onde.nome = {
        [Op.iLike]: `%${filtros.nome}%`
      };
    }
    const itens = await ItemCardapio.findAll({
      where: onde,
      order: [['nome', 'ASC']]
    });
    return itens;
  }
  async buscarPorId(id) {
    const item = await ItemCardapio.findByPk(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }
    return item;
  }
  async criar(dados) {
    if (!dados.nome || !dados.preco || !dados.tipo) {
      throw new Error('Nome, preço e tipo são obrigatórios');
    }
    if (!['PRATO', 'BEBIDA'].includes(dados.tipo)) {
      throw new Error('Tipo deve ser PRATO ou BEBIDA');
    }
    if (dados.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    const item = await ItemCardapio.create(dados);
    return item;
  }
  async atualizar(id, dados) {
    const item = await this.buscarPorId(id);
    if (dados.preco !== undefined && dados.preco <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    if (dados.tipo && !['PRATO', 'BEBIDA'].includes(dados.tipo)) {
      throw new Error('Tipo deve ser PRATO ou BEBIDA');
    }
    await item.update(dados);
    return item;
  }
  async deletar(id) {
    const item = await this.buscarPorId(id);
    await item.update({ ativo: false });
    return { mensagem: 'Item desativado com sucesso' };
  }
  async ativar(id) {
    const item = await this.buscarPorId(id);
    await item.update({ ativo: true });
    return item;
  }
}
module.exports = new ServicoItemCardapio();
