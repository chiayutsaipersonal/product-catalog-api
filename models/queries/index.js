const uuidV4 = require('uuid/v4')

const logging = require('../../controllers/logging')

module.exports = {
  bulkCreate,
  count,
  create,
  destroy,
  findAll,
  findById,
  findOne,
  findOrCreate,
  update,
}

function bulkCreate (model, payload, transaction = null) {
  let query = transaction
    ? model.bulkCreate(payload, { transaction })
    : model.bulkCreate(payload)
  return query
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, './models/queries/index.bulkCreate() errored')
      return Promise.reject(error)
    })
}

function count (model, criteria = {}) {
  return model
    .count(criteria)
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      logging.error(error, './models/queries/index.count() errored')
      return Promise.reject(error)
    })
}

function create (model, payload, transaction = null) {
  let data = !payload.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, payload)
    : payload
  let query = transaction
    ? model.create(payload, { transaction })
    : model.create(payload)
  return query
    .then(() => Promise.resolve(data.id))
    .catch(error => {
      logging.error(error, './models/queries/index.create() errored')
      return Promise.reject(error)
    })
}

function destroy (model, criteria, transaction = null) {
  let query = transaction
    ? model.destroy(criteria, { transaction })
    : model.destroy(criteria)
  return query
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      logging.error(error, './models/queries/index.destroy() errored')
      return Promise.reject(error)
    })
}

function findAll (model, payload) {
  return model
    .findAll({ where: payload })
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/index.find() errored')
      return Promise.reject(error)
    })
}

function findById (model, id) {
  return model
    .findById(id)
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      logging.error(error, './models/queries/index.findById() errored')
      return Promise.reject(error)
    })
}

function findOne (model, payload) {
  return model
    .findOne({ where: payload })
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      logging.error(error, './models/queries/index.findOne() errored')
      return Promise.reject(error)
    })
}

function findOrCreate (model, payload, transaction = null) {
  let query = transaction
    ? model.findOrCreate({ where: payload, transaction })
    : model.findOrCreate({ where: payload })
  return query
    .spread((queryResult, created) => Promise.resolve(queryResult || created))
    .catch(error => {
      logging.error(error, './models/queries/index.findOrInsert() errored')
      return Promise.reject(error)
    })
}

function update (model, payload, criteria = {}, transaction = null) {
  let query = transaction
    ? model.update(payload, { where: criteria, transaction })
    : model.update(payload, { where: criteria })
  return query
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      logging.error(error, './models/queries/index.update() errored')
      return Promise.reject(error)
    })
}
