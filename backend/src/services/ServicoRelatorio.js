const { sequelize } = require('../models');

class ServicoRelatorio {
  /**
   * Relatório de vendas diárias usando stored procedure
   */
  async relatorioVendasDiarias(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const [resultados] = await sequelize.query(
      'SELECT * FROM relatorio_vendas_diarias(:dataInicio, :dataFim)',
      {
        replacements: { dataInicio, dataFim }
      }
    );

    return resultados;
  }

  /**
   * Itens mais vendidos usando stored procedure
   */
  async itensMaisVendidos(dataInicio, dataFim, limite = 10) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const [resultados] = await sequelize.query(
      'SELECT * FROM itens_mais_vendidos(:dataInicio, :dataFim, :limite)',
      {
        replacements: { dataInicio, dataFim, limite }
      }
    );

    return resultados;
  }

  /**
   * Relatório simplificado do dia atual
   */
  async relatorioDiarioSimplificado() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const dataInicio = hoje.toISOString().split('T')[0];
    const dataFim = hoje.toISOString().split('T')[0];

    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 5);

    return {
      data: dataInicio,
      resumo: vendas[0] || {
        data: dataInicio,
        total_comandas: 0,
        total_vendas: 0,
        total_itens_vendidos: 0,
        ticket_medio: 0
      },
      itens_mais_vendidos: itensMaisVendidos
    };
  }

  /**
   * Relatório detalhado de período
   */
  async relatorioPeriodo(dataInicio, dataFim) {
    if (!dataInicio || !dataFim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const vendas = await this.relatorioVendasDiarias(dataInicio, dataFim);
    const itensMaisVendidos = await this.itensMaisVendidos(dataInicio, dataFim, 20);

    // Calcular totais do período
    const totais = vendas.reduce((acc, dia) => ({
      total_comandas: acc.total_comandas + parseInt(dia.total_comandas || 0),
      total_vendas: acc.total_vendas + parseFloat(dia.total_vendas || 0),
      total_itens: acc.total_itens + parseInt(dia.total_itens_vendidos || 0)
    }), { total_comandas: 0, total_vendas: 0, total_itens: 0 });

    return {
      periodo: {
        inicio: dataInicio,
        fim: dataFim
      },
      totais: {
        ...totais,
        ticket_medio: totais.total_comandas > 0
          ? (totais.total_vendas / totais.total_comandas).toFixed(2)
          : 0
      },
      vendas_por_dia: vendas,
      itens_mais_vendidos: itensMaisVendidos
    };
  }
}

module.exports = new ServicoRelatorio();
const { Comanda, ItemComanda, ItemCardapio } = require('../models');
const { Op } = require('sequelize');

class ServicoComanda {
  async listarTodas(filtros = {}) {
    const onde = {};

    // Filtrar por status
    if (filtros.status) {
      onde.status = filtros.status;
    }

    // Filtrar por mesa
    if (filtros.numero_mesa) {
      onde.numero_mesa = filtros.numero_mesa;
    }

    // Filtrar por data
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
    // Validações
    if (!dados.numero_mesa) {
      throw new Error('Número da mesa é obrigatório');
    }

    // Verificar se já existe comanda aberta para a mesa
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

    // Verificar se comanda está aberta
    if (comanda.status !== 'ABERTA') {
      throw new Error('Não é possível adicionar itens em uma comanda fechada');
    }

    // Validações
    if (!dados.item_cardapio_id) {
      throw new Error('Item do cardápio é obrigatório');
    }

    if (!dados.quantidade || dados.quantidade < 1) {
      throw new Error('Quantidade deve ser no mínimo 1');
    }

    // Buscar item do cardápio
    const itemCardapio = await ItemCardapio.findByPk(dados.item_cardapio_id);

    if (!itemCardapio) {
      throw new Error('Item do cardápio não encontrado');
    }

    if (!itemCardapio.ativo) {
      throw new Error('Item do cardápio não está disponível');
    }

    // Criar item da comanda
    const itemComanda = await ItemComanda.create({
      comanda_id: comandaId,
      item_cardapio_id: dados.item_cardapio_id,
      quantidade: dados.quantidade,
      preco_unitario: itemCardapio.preco,
      subtotal: itemCardapio.preco * dados.quantidade,
      observacoes: dados.observacoes,
      status_producao: 'PENDENTE'
    });

    // Recarregar com associações
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

    // Verificar se já está fechada
    if (comanda.status !== 'ABERTA') {
      throw new Error('Comanda já está fechada');
    }

    // Verificar se todos os itens foram entregues
    const itensNaoEntregues = comanda.itens.filter(
      item => item.status_producao !== 'ENTREGUE'
    );

    if (itensNaoEntregues.length > 0) {
      throw new Error('Não é possível fechar a comanda. Existem itens que não foram entregues.');
    }

    // Fechar comanda
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

