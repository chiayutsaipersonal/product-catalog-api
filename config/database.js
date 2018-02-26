require('dotenv').config()

const path = require('path')

const appConfig = require('config/app')

const logging = require('controllers/logging')

const dbLocation = path.resolve('./data')
const ormVerbose = false

const mysqlConfig = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  logging: ormVerbose ? logging.warning : false,
  timezone: appConfig.timezone,
  pool: {
    max: 5, // default: 5
    min: 0, // default: 0
    idle: 10000, // default: 10000
    acquire: 10000, // default: 10000
    evict: 10000, // default: 10000
    retry: { max: 3 },
  },
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
  // migrationStorage: 'json',
  // seederStorage: 'json',
}

const sqliteConfig = {
  dialect: 'sqlite',
  location: dbLocation, // not sqlite standard option
  storage: path.join(dbLocation, `${appConfig.reference}.db`),
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
  // migrationStorage: 'json',
  // seederStorage: 'json',
}

const configOptions = {
  development: sqliteConfig,
  test: sqliteConfig,
  staging: mysqlConfig,
  production: mysqlConfig,
}

module.exports = environment => {
  return configOptions[environment]
}
