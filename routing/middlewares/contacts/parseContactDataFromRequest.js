const encryption = require('controllers/encryption')

module.exports = parseContactDataFromRequest

/**
 * Parse contact data from req.body.  *Note: req.body.password is not required (account will be generated without login priv)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function parseContactDataFromRequest (req, res, next) {
  let requestBody = req.body
  let encryptedPassword =
    'password' in requestBody
      ? encryption.sha512(requestBody.password, encryption.saltGen(16))
      : { hashedPassword: null, salt: null }
  req.contactData = {
    email: requestBody.email,
    name: requestBody.name,
    hashedPassword: encryptedPassword.hashedPassword,
    salt: encryptedPassword.salt,
  }
  if (requestBody.mobile) req.contactData.mobile = requestBody.mobile
  return next()
}
