'use strict';

module.exports = (sequelize, DataTypes) => {
  const ItemCardapio = sequelize.define('ItemCardapio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    tipo: {
      type: DataTypes.ENUM('PRATO', 'BEBIDA'),
      allowNull: false,
      comment: 'PRATO vai para Cozinha, BEBIDA vai para Copa'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tempo_preparo_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tempo estimado de preparo em minutos'
    }
  }, {
    tableName: 'itens_cardapio',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    indexes: [
      {
        fields: ['tipo']
      },
      {
        fields: ['ativo']
      }
    ]
  });

  ItemCardapio.associate = function(models) {
    ItemCardapio.hasMany(models.ItemComanda, {
      foreignKey: 'item_cardapio_id',
      as: 'itens_comanda'
    });
  };

  return ItemCardapio;
};

