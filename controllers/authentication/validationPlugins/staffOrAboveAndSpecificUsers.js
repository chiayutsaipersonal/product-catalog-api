const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const checkJwtError = require('./checkJwtError')
const parseContactIdFromRequest = require('./parseContactIdFromRequest')

module.exports = staffOrAboveAndSpecificUsers

function staffOrAboveAndSpecificUsers (req, res, next) {
  return (error, contact, info) => {
    // determine if jwt decoding procedure is successful
    let custErr = checkJwtError(error, info)
    if (custErr) return next(custErr)

    custErr = {
      origin: `${__filename}.${getFuncName(staffOrAboveAndSpecificUsers)}`,
    }

    // check if jwt yields to a registered contact
    if (!contact) {
      custErr.statusCode = 401
      custErr.title = 'Unauthorized'
      custErr.message = 'Contact account not found'
      return next(genCustErr(custErr))
    }

    let isSpecificUser = !(parseContactIdFromRequest(req) !== true)
    let isAdmin = contact.admin === true
    let isStaff = contact.company !== null && contact.company.host

    custErr.statusCode = 401
    custErr.title = 'Forbidden'
    custErr.message =
      'Only staff, admin or specific users have access privilege'
    return isAdmin || isStaff || !isSpecificUser
      ? next()
      : next(genCustErr(custErr))
  }
}
