const db = require('controllers/database/index').db()
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const findById = require('models/queries/index').findById

module.exports = getContactDetailsById

/**
 * get detailed contact record by id stored in req.contactId
 * @param {*} param0
 */
function getContactDetailsById ({ failIfNotFound = true } = {}) {
  return (req, res, next) => {
    let contactId = req.contactId
    let custErr = {
      origin: `${__filename}.${getFuncName(getContactDetailsById)}`,
      statusCode: 500,
      title: 'Unregistered contact',
      message: `Contact does not exist (id: ${contactId})`,
    }
    let model = db.Contacts.scope({ method: ['detailed'] })
    return findById({ model, id: contactId })
      .then(detailedContact => {
        if (!detailedContact && failIfNotFound) {
          return Promise.reject(genCustErr(custErr))
        }
        req.contact = detailedContact
        next()
        return Promise.resolve()
      })
      .catch(error => {
        error.origin = custErr.origin
        return next(error)
      })
  }
}
