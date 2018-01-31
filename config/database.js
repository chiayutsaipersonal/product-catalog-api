const path = require('path')

const logging = require('../controllers/logging')

const appConfig = require('../config/app')

const ormVerbose = false

module.exports = {
  dialect: 'sqlite',
  location: path.resolve('./data'), // not sqlite standard option
  storage: path.resolve(`./data/${appConfig.reference}.db`),
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
