const checkJwtError = require('./checkJwtError')
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = staffOrAbove

function staffOrAbove (req, res, next) {
  return (error, contact, info) => {
    // determine if jwt decoding procedure is successful
    let custErr = checkJwtError(error, info)
    if (custErr) return next(custErr)

    custErr = { origin: `${__filename}.${getFuncName(staffOrAbove)}` }

    // check if jwt yields to a registered contact
    if (!contact) {
      custErr.statusCode = 401
      custErr.title = 'Unregistered contact'
      custErr.message = 'Contact account not found'
      return next(genCustErr(custErr))
    }

    // allow admin access immediately
    if (contact.admin) return next()

    // allow access if account is associated with 'hosting' company
    if (contact.company && contact.company.host) return next()

    // otherwise, block access
    custErr.statusCode = 403
    custErr.title = 'Staff or above privilege required'
    custErr.message = 'Only staff or admins are authorized'
    return next(genCustErr(custErr))
  }
}
