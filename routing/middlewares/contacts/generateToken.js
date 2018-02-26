const jwt = require('jsonwebtoken')

const jwtSecret = require('config/authentication').jwtSecret

module.exports = generateToken

/**
 * generate a self-signed token from a contact credentials
 * and place in the pending json response object 'req.resJson'
 *
 * it assumes credentials supplied were validated prior to its execution
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function generateToken (req, res, next) {
  let credentials = req.contact
  let token = credentials.hashedPassword
    ? jwt.sign(
      {
        id: credentials.id,
        name: credentials.name,
        email: credentials.email,
        admin: credentials.admin,
      },
      jwtSecret,
      { expiresIn: '24h' }
    )
    : undefined
  req.resJson = { data: token }
  return next()
}
