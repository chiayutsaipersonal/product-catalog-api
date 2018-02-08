const Promise = require('bluebird')

const logging = require('../../controllers/logging')

module.exports = {
  bulkCreate,
}

function bulkCreate (db, payload, transaction = null) {
  let query = transaction
    ? db.Countries.bulkCreate(payload, { transaction })
    : db.Countries.bulkCreate(payload)
  return query
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, './models/queries/countries.bulkCreate() errored')
      return Promise.reject(error)
    })
}
