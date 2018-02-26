const db = require('controllers/database/index').db()
const getFuncName = require('controllers/index').getFuncName

const create = require('models/queries/index').create

module.exports = independentContact

/**
 * create an contact record without association to any company record
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function independentContact (req, res, next) {
  let origin = `${__filename}.${getFuncName(independentContact)}`
  return create({ model: db.Contacts, payload: req.contactData })
    .then(newContactId => {
      req.contactId = newContactId
      next()
      return Promise.resolve()
    })
    .catch(error => {
      error.origin = origin
      return next(error)
    })
}
