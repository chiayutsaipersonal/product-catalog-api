const checkJwtError = require('./checkJwtError')
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = adminsOnly

function adminsOnly (req, res, next) {
  return (error, contact, info) => {
    // determine if jwt decoding procedure is successful
    let custErr = checkJwtError(error, info)
    if (custErr) return next(custErr)

    custErr = { origin: `${__filename}.${getFuncName(adminsOnly)}` }

    // check if jwt yields to a registered contact
    if (!contact) {
      custErr.statusCode = 401
      custErr.title = 'Unregistered contact'
      custErr.message = 'Contact account not found'
      return next(genCustErr(custErr))
    }

    // allow admin access
    if (contact.admin) return next()

    // otherwise block access
    custErr.statusCode = 403
    custErr.title = 'Admin privilege required'
    custErr.message = 'Only admin accounts are authorized'
    return next(genCustErr(custErr))
  }
}
