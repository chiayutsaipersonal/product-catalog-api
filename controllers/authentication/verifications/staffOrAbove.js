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
          '\'staffOrAbove\' verification error',
          'Unregistered user account'
        )
      )
    } else {
      // allow admin access immediately
      if (contact.admin) return next()
      // allow access if account is associated with 'hosting' company
      if (contact.company && contact.company.host) return next()
      // otherwise, block access
      return next(
        generateCustomError(
          403,
          '\'staffOrAbove\' verification error',
          'Only staff or admins are authorized'
        )
      )
    }
  }
}
