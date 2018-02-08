const logging = require('../logging')

const Sequelize = require('sequelize')

const appConfig = require('../../config/app')
const dbConfig = require('../../config/database')[appConfig.nodeEnv]

module.exports = () => {
  let db = {
    Sequelize: Sequelize,
    sequelize: new Sequelize(dbConfig),
  }
  return db.sequelize
    .authenticate()
    .then(() => {
      logging.console('Sequelize instantiated')
      return Promise.resolve(db)
    })
    .catch(error => {
      logging.warning('Sequelize instantiation failure')
      return Promise.reject(error)
    })
}
