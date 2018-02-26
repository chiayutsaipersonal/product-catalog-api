const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Labels = sequelize.define(
    'labels',
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: { isUUID: 4 },
        set (val) {
          this.setDataValue('productId', val.toUpperCase())
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
    },
    {
      name: {
        singular: 'label',
        plural: 'labels',
      },
    }
  )
  return Labels
}
