const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = noLoginPrivilege

/**
 * deny access if the registered contact account has 'empty' password fields
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function noLoginPrivilege (req, res, next) {
  let credentials = req.contact
  if (!credentials.hashedPassword || !credentials.salt) {
    return next(
      genCustErr({
        origin: `${__filename}.${getFuncName(noLoginPrivilege)}`,
        statusCode: 403,
        title: 'Empty password',
        message: 'This account does not have login privileges',
      })
    )
  }
  return next()
}
