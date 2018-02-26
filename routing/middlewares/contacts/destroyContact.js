const db = require('controllers/database/index').db()
const getFuncName = require('controllers/index').getFuncName

const destroy = require('models/queries/index').destroy

module.exports = destroyContact

/**
 * create an contact record without association to any company record
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function destroyContact (req, res, next) {
  let origin = `${__filename}.${getFuncName(destroyContact)}`
  return destroy({ model: db.Contacts, criteria: { id: req.contactId } })
    .then(() => {
      req.resJson = { message: 'Contact deleted' }
      next()
      return Promise.resolve()
    })
    .catch(error => {
      error.origin = origin
      return next(error)
    })
}
