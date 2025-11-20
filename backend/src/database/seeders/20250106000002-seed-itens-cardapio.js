'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('itens_cardapio', [
      // PRATOS (Cozinha)
      {
        nome: 'Filé Mignon com Fritas',
        descricao: 'Filé mignon grelhado acompanhado de batatas fritas e salada',
        preco: 45.90,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 25,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Risoto de Camarão',
        descricao: 'Risoto cremoso com camarões frescos e parmesão',
        preco: 52.00,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 30,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Lasanha à Bolonhesa',
        descricao: 'Lasanha caseira com molho bolonhesa e queijo gratinado',
        preco: 38.50,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 20,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Picanha na Chapa',
        descricao: 'Picanha grelhada com arroz, feijão, farofa e vinagrete',
        preco: 55.00,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 30,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Salmão Grelhado',
        descricao: 'Filé de salmão grelhado com legumes e arroz',
        preco: 48.90,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 20,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Frango à Parmegiana',
        descricao: 'Filé de frango empanado com molho de tomate e queijo gratinado',
        preco: 35.00,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 25,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Hambúrguer Artesanal',
        descricao: 'Hambúrguer de carne bovina com queijo, alface, tomate e batata frita',
        preco: 32.00,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 15,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Pizza Margherita',
        descricao: 'Pizza tradicional com mussarela, tomate e manjericão',
        preco: 42.00,
        tipo: 'PRATO',
        ativo: true,
        tempo_preparo_minutos: 20,
        criado_em: new Date(),
        atualizado_em: new Date()
      },

      // BEBIDAS (Copa)
      {
        nome: 'Refrigerante Lata',
        descricao: 'Coca-Cola, Guaraná ou Sprite - 350ml',
        preco: 6.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 2,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Suco Natural',
        descricao: 'Suco de laranja, limão, abacaxi ou morango - 500ml',
        preco: 12.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 5,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Água Mineral',
        descricao: 'Água mineral sem gás - 500ml',
        preco: 4.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 1,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Cerveja Long Neck',
        descricao: 'Cerveja gelada - 355ml',
        preco: 8.50,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 2,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Caipirinha',
        descricao: 'Caipirinha de limão, morango ou abacaxi',
        preco: 15.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 5,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Vinho Taça',
        descricao: 'Vinho tinto ou branco - 150ml',
        preco: 18.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 3,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Café Expresso',
        descricao: 'Café expresso tradicional',
        preco: 5.00,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 3,
        criado_em: new Date(),
        atualizado_em: new Date()
      },
      {
        nome: 'Chá Gelado',
        descricao: 'Chá gelado de limão ou pêssego - 400ml',
        preco: 7.50,
        tipo: 'BEBIDA',
        ativo: true,
        tempo_preparo_minutos: 3,
        criado_em: new Date(),
        atualizado_em: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('itens_cardapio', null, {});
  }
};

