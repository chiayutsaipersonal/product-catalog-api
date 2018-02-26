const db = require('controllers/database/index').db()
const getFuncName = require('controllers/index').getFuncName

const update = require('models/queries/index').update

module.exports = editContact

/**
 * get detailed contact record by id stored in req.contactId
 * @param {*} param0
 */
function editContact (req, res, next) {
  return update({
    model: db.Contacts,
    payload: req.contact,
    criteria: { id: req.contactId },
  })
    .then(result => {
      next()
      return Promise.resolve()
    })
    .catch(error => {
      error.origin = `${__filename}.${getFuncName(editContact)}`
      error.statusCode = 500
      return next(error)
    })
}
