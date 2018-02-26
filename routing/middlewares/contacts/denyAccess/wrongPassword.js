const encryption = require('controllers/encryption')
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = wrongPassword

/**
 * deny access if submitted password does not match the retrieved credentials
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function wrongPassword (req, res, next) {
  let custErr = {
    origin: `${__filename}.${getFuncName(wrongPassword)}`,
    statusCode: 403,
    title: 'Forbidden',
    message: 'Failure in credential verification',
  }
  let credentials = req.contact
  let hashedPassword = encryption.sha512(req.body.password, credentials.salt)
    .hashedPassword
  return hashedPassword === credentials.hashedPassword
    ? next()
    : next(genCustErr(custErr))
}
