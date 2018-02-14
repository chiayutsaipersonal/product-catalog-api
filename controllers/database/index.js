const logging = require('../logging')

const authenticate = require('./authenticate')
const register = require('./register')
const scopes = require('./scopes')
const sync = require('./sync')
const associate = require('./associate')

let databaseInstance = null

module.exports = {
  db: databaseInstance,
  init,
}

function init () {
  return authenticate()
    .then(db => register(db))
    .then(db => sync(db))
    .then(db => associate(db))
    .then(db => sync(db))
    .then(db => scopes(db))
    .then(db => {
      databaseInstance = db
      return Promise.resolve('Database initialization completed')
    })
    .catch(error => {
      logging.error(error, 'Database initialization failure')
      return Promise.reject(error)
    })
}
