const uuidV4 = require('uuid/v4')

const logging = require('../../controllers/logging')

module.exports = {
  bulkCreate,
  findOrInsert,
  insert,
}

function bulkCreate (db, payload, transaction = null) {
  let query = transaction
    ? db.Tags.bulkCreate(payload, { transaction })
    : db.Tags.bulkCreate(payload)
  return query
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, './models/queries/tags.bulkCreate() errored')
      return Promise.reject(error)
    })
}

function findOrInsert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Tags.findOrCreate({ where: data, transaction })
    : db.Tags.findOrCreate({ where: data })
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/tags.findOrInsert() errored')
      return Promise.reject(error)
    })
}

function insert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Tags.create(data, { transaction })
    : db.Tags.create(data)
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/tags.insert() errored')
      return Promise.reject(error)
    })
}
