const db = require('controllers/database/index').db()
const getFuncName = require('controllers/index').getFuncName

const findAll = require('models/queries/index').findAll

module.exports = getContactsWithDetails

/**
 * get detailed contact record by id stored in req.contactId
 * @param {*} param0
 */
function getContactsWithDetails (criteria = {}) {
  return (req, res, next) => {
    let model = db.Contacts.scope({ method: ['detailed'] })
    return findAll({ model, criteria })
      .then(detailedContacts => {
        req.contacts = detailedContacts
        next()
        return Promise.resolve()
      })
      .catch(error => {
        error.origin = `${__filename}.${getFuncName(getContactsWithDetails)}`
        return next(error)
      })
  }
}
