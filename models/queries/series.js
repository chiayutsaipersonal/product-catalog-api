const uuidV4 = require('uuid/v4')

const logging = require('../../controllers/logging')

module.exports = {
  bulkCreate,
  findOrInsert,
  insert,
}

function bulkCreate (db, payload, transaction = null) {
  let query = transaction
    ? db.Series.bulkCreate(payload, { transaction })
    : db.Series.bulkCreate(payload)
  return query
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, './models/queries/series.bulkCreate() errored')
      return Promise.reject(error)
    })
}

function findOrInsert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Series.findOrCreate({ where: data, transaction })
    : db.Series.findOrCreate({ where: data })
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/series.findOrInsert() errored')
      return Promise.reject(error)
    })
}

function insert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Series.create(data, { transaction })
    : db.Series.create(data)
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/series.insert() errored')
      return Promise.reject(error)
    })
}
