'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itens_comanda', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      comanda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'comandas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_cardapio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'itens_cardapio',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      preco_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Preço do item no momento do pedido'
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'quantidade * preco_unitario'
      },
      status_producao: {
        type: Sequelize.ENUM('PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE'),
        allowNull: false,
        defaultValue: 'PENDENTE'
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      data_producao_iniciada: {
        type: Sequelize.DATE,
        allowNull: true
      },
      data_producao_finalizada: {
        type: Sequelize.DATE,
        allowNull: true
      },
      data_entrega: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('itens_comanda', ['comanda_id']);
    await queryInterface.addIndex('itens_comanda', ['item_cardapio_id']);
    await queryInterface.addIndex('itens_comanda', ['status_producao']);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('itens_comanda');
  }
};
