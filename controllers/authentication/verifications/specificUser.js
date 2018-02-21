const checkJwtError = require('./helpers').checkJwtError
const generateCustomError = require('./helpers').generateCustomError

module.exports = (req, res, next) => {
  return (error, contact, info) => {
    let customError = checkJwtError(error, info)
    if (customError) return next(customError)
    if (!contact) {
      return next(
        generateCustomError(
          401,
          '\'specificUser\' verification error',
          'Unregistered user account'
        )
      )
    } else {
      // parse contactId from either req.params or req.body
      let parsedContactId =
        'contactId' in req.params
          ? req.params.contactId.toUpperCase()
          : 'contactId' in req.body ? req.body.contactId.toUpperCase() : null
      // if contact id is not found by the request then error out
      // doesn't make sense to restric specific user access if the route
      // does not have user identifying properties
      if (!parsedContactId) {
        generateCustomError(
          400,
          '\'specificUser\' verification error',
          'Required \'contactId\' is missing'
        )
      }
      // account 'contactId' does not match the identifying property of the request
      if (contact.id !== parsedContactId) {
        generateCustomError(
          400,
          '\'specificUser\' verification error',
          'Private route access restricted'
        )
      }
      // check for the following and block access - make sure only a customer can obtain access
      // account is not associated with any 'company' records
      // account's associated company should not be hosting company
      if (
        !contact.company ||
        (contact.company.Id !== null && contact.company.host)
      ) {
        generateCustomError(
          401,
          '\'staffOrAbove\' verification error',
          'Only customers are allowed access'
        )
      }
      return next()
    }
  }
}
