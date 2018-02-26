const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const OrderDetails = sequelize.define(
    'orderDetails',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidV4().toUpperCase(),
        validate: { isUUID: 4 },
        set (val) {
          this.setDataValue('id', val.toUpperCase())
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1 },
      },
      purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: { isUUID: 4 },
        set (val) {
          this.setDataValue('purchaseOrderId', val.toUpperCase())
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: { isUUID: 4 },
        set (val) {
          this.setDataValue('productId', val.toUpperCase())
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      name: {
        singular: 'orderDetail',
        plural: 'orderDetails',
      },
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      defaultScope: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
    }
  )
  return OrderDetails
}
