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
          '\'adminsOnly\' verification error',
          'Unregistered user account'
        )
      )
    } else {
      // allow admin access
      if (contact.admin) return next()
      // otherwise block access
      return next(
        generateCustomError(
          403,
          '\'adminsOnly\' verification error',
          'Only admin accounts are authorized'
        )
      )
    }
  }
}
