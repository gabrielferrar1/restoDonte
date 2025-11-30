'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comanda = sequelize.define('Comanda', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_mesa: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_cliente: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ABERTA', 'FECHADA', 'PAGA'),
      allowNull: false,
      defaultValue: 'ABERTA'
    },
    data_abertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    data_fechamento: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: sequelize.literal('0.00'),
      comment: 'Calculado automaticamente pela trigger'
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'comandas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['data_abertura']
      },
      {
        fields: ['numero_mesa']
      }
    ]
  });

  Comanda.associate = function(models) {
    Comanda.hasMany(models.ItemComanda, {
      foreignKey: 'comanda_id',
      as: 'itens'
    });
  };

  return Comanda;
};

