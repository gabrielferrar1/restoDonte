'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemComanda = sequelize.define('ItemComanda', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'comandas',
        key: 'id'
      }
    },
    item_cardapio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'itens_cardapio',
        key: 'id'
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Preço do item no momento do pedido'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'quantidade * preco_unitario'
    },
    status_producao: {
      type: DataTypes.ENUM('PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE'),
      allowNull: false,
      defaultValue: 'PENDENTE'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_producao_iniciada: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_producao_finalizada: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_entrega: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'itens_comanda',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    indexes: [
      {
        fields: ['comanda_id']
      },
      {
        fields: ['item_cardapio_id']
      },
      {
        fields: ['status_producao']
      }
    ]
  });

  ItemComanda.associate = function(models) {
    ItemComanda.belongsTo(models.Comanda, {
      foreignKey: 'comanda_id',
      as: 'comanda'
    });

    ItemComanda.belongsTo(models.ItemCardapio, {
      foreignKey: 'item_cardapio_id',
      as: 'item_cardapio'
    });
  };

  return ItemComanda;
};
