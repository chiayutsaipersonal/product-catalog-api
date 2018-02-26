const uuidV4 = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define(
    'contacts',
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
      email: {
        type: DataTypes.STRING,
        unique: 'emailConstraint',
        allowNull: false,
        validate: { isEmail: true },
        set (val) {
          this.setDataValue('email', val.toLowerCase())
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: true,
        validate: { isUUID: 4 },
        set (val) {
          this.setDataValue('companyId', val.toUpperCase())
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
        unique: 'emailConstraint',
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      name: {
        singular: 'contact',
        plural: 'contacts',
      },
      timestamps: true,
      paranoid: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      defaultScope: {
        attributes: ['id', 'email', 'name', 'mobile', 'companyId', 'admin'],
        order: ['name'],
      },
    }
  )
  return Contacts
}
