const uuidV4 = require('uuid/v4')

const db = require('controllers/database/index').db()
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = {
  bulkCreate,
  count,
  create,
  destroy,
  findAll,
  findById,
  findOne,
  findOrCreate,
  rawQueries,
  update,
}

function bulkCreate ({
  model = handleMissingModelError(bulkCreate),
  payload = {},
  transaction = null,
}) {
  let query = transaction
    ? model.bulkCreate(payload, { transaction })
    : model.bulkCreate(payload)
  return query.then(() => Promise.resolve()).catch(error => {
    error.origin = `${__filename}.${getFuncName(bulkCreate)}`
    return Promise.reject(error)
  })
}

function count ({ model = handleMissingModelError(count), criteria = {} }) {
  return model
    .count({ where: criteria })
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(count)}`
      return Promise.reject(error)
    })
}

function create ({
  model = handleMissingModelError(create),
  payload = {},
  transaction = null,
}) {
  let data = !payload.id ? Object.assign({ id: uuidV4() }, payload) : payload
  let query = transaction
    ? model.create(data, { transaction })
    : model.create(data)
  return query
    .then(() => Promise.resolve(data.id.toUpperCase()))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(create)}`
      return Promise.reject(error)
    })
}

function destroy ({
  model = handleMissingModelError(destroy),
  criteria = {},
  transaction = null,
}) {
  let query = transaction
    ? model.destroy({ where: criteria, transaction })
    : model.destroy({ where: criteria })
  return query
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(destroy)}`
      return Promise.reject(error)
    })
}

function findAll ({ model = handleMissingModelError(findAll), criteria = {} }) {
  return model
    .findAll({ where: criteria })
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(findAll)}`
      return Promise.reject(error)
    })
}

function findById ({ model = handleMissingModelError(findById), id = null }) {
  return model
    .findById(id)
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(findById)}`
      return Promise.reject(error)
    })
}

function findOne ({ model = handleMissingModelError(findOne), criteria = {} }) {
  return model
    .findOne({ where: criteria })
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(findOne)}`
      return Promise.reject(error)
    })
}

function findOrCreate ({
  model = handleMissingModelError(findOrCreate),
  payload = {},
  transaction = null,
}) {
  let query = transaction
    ? model.findOrCreate({ where: payload, transaction })
    : model.findOrCreate({ where: payload })
  return query
    .spread((queryResult, created) => Promise.resolve(queryResult || created))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(findOrCreate)}`
      return Promise.reject(error)
    })
}

function rawQueries ({
  queryString = handleMissingModelError(rawQueries),
  transaction = null,
}) {
  return db.sequelize
    .query(queryString, { logging: console.log })
    .spread((result, metadata) => Promise.resolve(result))
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(rawQueries)}`
      Promise.reject(error)
    })
}

function update ({
  model = handleMissingModelError(update),
  payload = {},
  criteria = {},
  transaction = null,
}) {
  let query = transaction
    ? model.update(payload, { where: criteria, transaction })
    : model.update(payload, { where: criteria })
  return query.then(result => Promise.resolve(result[0])).catch(error => {
    error.origin = `${__filename}.${getFuncName(update)}`
    return Promise.reject(error)
  })
}

function handleMissingModelError (funcHandle) {
  throw genCustErr({
    origin: `${__filename}.${getFuncName(funcHandle)}`,
    statusCode: 500,
    title: 'Model param is required',
  })
}
