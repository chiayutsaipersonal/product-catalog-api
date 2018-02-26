const logging = require('controllers/logging')

const authenticate = require('controllers/database/authenticate')
const register = require('controllers/database/register')
const scopes = require('controllers/database/scopes')
const sync = require('controllers/database/sync')
const associate = require('controllers/database/associate')

var databaseInstance = null

module.exports = {
  db: () => databaseInstance,
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
