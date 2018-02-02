const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database').db
const logging = require('../../controllers/logging')

module.exports = {
  // insert queries
  insert,
}

// find or insert a company record
// returns promise that resolves to the record id
function insert (data, transaction = null) {
  let record = !data.id
    ? Object.assign({ id: uuidV4().toUpperCase() }, data)
    : data
  let query = transaction
    ? db.PurchaseOrders.create(record, { transaction })
    : db.PurchaseOrders.create(record)
  return query
    .then(() => Promise.resolve(record.id))
    .catch(error => {
      logging.error(error, './models/queries/purchaseOrders.insert() errored')
      return Promise.reject(error)
    })
}
