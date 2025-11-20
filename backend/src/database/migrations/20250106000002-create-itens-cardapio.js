'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itens_cardapio', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('PRATO', 'BEBIDA'),
        allowNull: false,
        comment: 'PRATO vai para Cozinha, BEBIDA vai para Copa'
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      tempo_preparo_minutos: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tempo estimado de preparo em minutos'
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionar índices para melhor performance
    await queryInterface.addIndex('itens_cardapio', ['tipo']);
    await queryInterface.addIndex('itens_cardapio', ['ativo']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('itens_cardapio');
  }
};

