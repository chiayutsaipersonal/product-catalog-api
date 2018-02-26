const uuidV4 = require('uuid/v4')

const logging = require('controllers/logging')
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
    logging.warning(`${__filename}.${getFuncName(bulkCreate)} errored`)
    return Promise.reject(error)
  })
}

function count ({ model = handleMissingModelError(count), criteria = {} }) {
  return model
    .count({ where: criteria })
    .then(recordCount => Promise.resolve(recordCount))
    .catch(error => {
      logging.warning(`${__filename}.${getFuncName(count)} errored`)
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
      logging.warning(`${__filename}.${getFuncName(create)} errored`)
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
      logging.warning(`${__filename}.${getFuncName(destroy)} errored`)
      return Promise.reject(error)
    })
}

function findAll ({ model = handleMissingModelError(findAll), criteria = {} }) {
  return model
    .findAll({ where: criteria })
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.warning(`${__filename}.${getFuncName(findAll)} errored`)
      return Promise.reject(error)
    })
}

function findById ({ model = handleMissingModelError(findById), id = null }) {
  return model
    .findById(id)
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      logging.warning(`${__filename}.${getFuncName(findById)} errored`)
      return Promise.reject(error)
    })
}

function findOne ({ model = handleMissingModelError(findOne), criteria = {} }) {
  return model
    .findOne({ where: criteria })
    .then(queryResult => Promise.resolve(queryResult))
    .catch(error => {
      logging.warning(`${__filename}.${getFuncName(findOne)} errored`)
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
      logging.warning(`${__filename}.${getFuncName(findOrCreate)}() errored`)
      return Promise.reject(error)
    })
}

function update ({
  model = handleMissingModelError(),
  payload = {},
  criteria = {},
  transaction = null,
}) {
  let query = transaction
    ? model.update(payload, { where: criteria, transaction })
    : model.update(payload, { where: criteria })
  return query.then(result => Promise.resolve(result[0])).catch(error => {
    logging.warning(`${__filename}.${getFuncName(update)}() errored`)
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
