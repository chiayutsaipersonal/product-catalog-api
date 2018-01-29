const path = require('path')

const logging = require('../controllers/logging')

const appConfig = require('../config/app')

const ormVerbose = false

module.exports = {
  dialect: 'sqlite',
  storage: path.resolve(`./data/${appConfig.reference}.db`),
  database: appConfig.reference,
  logging: ormVerbose ? logging.warning : false,
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: false,
    paranoid: false,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  },
  operatorsAliases: false,
}
