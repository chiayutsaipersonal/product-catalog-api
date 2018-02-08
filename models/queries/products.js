const uuidV4 = require('uuid/v4')

const logging = require('../../controllers/logging')

module.exports = {
  bulkCreate,
  findOrInsert,
  insert,
}

function bulkCreate (db, payload, transaction = null) {
  let query = transaction
    ? db.Products.bulkCreate(payload, { transaction })
    : db.Products.bulkCreate(payload)
  return query
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, './models/queries/products.bulkCreate() errored')
      return Promise.reject(error)
    })
}

function findOrInsert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Products.findOrCreate({ where: data, transaction })
    : db.Products.findOrCreate({ where: data })
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/products.findOrInsert() errored')
      return Promise.reject(error)
    })
}

function insert (db, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? db.Products.create(data, { transaction })
    : db.Products.create(data)
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/products.insert() errored')
      return Promise.reject(error)
    })
}
