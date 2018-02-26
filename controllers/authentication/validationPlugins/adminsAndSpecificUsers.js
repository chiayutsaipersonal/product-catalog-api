const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const checkJwtError = require('./checkJwtError')
const parseContactIdFromRequest = require('./parseContactIdFromRequest')

module.exports = adminsAndSpecificUsers

function adminsAndSpecificUsers (req, res, next) {
  return (error, contact, info) => {
    // determine if jwt decoding procedure is successful
    let custErr = checkJwtError(error, info)
    if (custErr) return next(custErr)

    custErr = { origin: `${__filename}.${getFuncName(adminsAndSpecificUsers)}` }

    // check if jwt yields to a registered contact
    if (!contact) {
      custErr.statusCode = 401
      custErr.title = 'Unauthorized'
      custErr.message = 'Contact account not found'
      return next(genCustErr(custErr))
    }

    // allow admin access
    if (contact.admin) return next()

    // parse contactId from either req.params.contactId or req.body.contactId
    let parsedContactId = parseContactIdFromRequest(req)

    // if contact id is not found by the request then error out
    // doesn't make sense to restric specific user access if the route
    // does not have user identifying properties
    if (!parsedContactId) {
      custErr.statusCode = 400
      custErr.title = 'Bad request'
      custErr.message = '\'contactId\' not submitted'
      return next(genCustErr(custErr))
    }

    // account 'contactId' does not match the identifying property of the request
    if (contact.id !== parsedContactId) {
      custErr.statusCode = 401
      custErr.title = 'Unauthorized'
      custErr.message = 'JWT does not match to any registered account'
      return next(genCustErr(custErr))
    }

    // block all except 'customer' accounts (not associated with any company or is associated with a company that isn't the hosting company)
    if (contact.company !== null && contact.company.host) {
      custErr.statusCode = 403
      custErr.title = 'Forbidden'
      custErr.message = 'Only customers are allowed access'
      return next(genCustErr(custErr))
    }

    // allow access for a specific user
    return next()
  }
}
