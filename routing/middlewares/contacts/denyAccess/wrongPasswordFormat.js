const passwordLength = require('config/authentication').passwordLength

const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = wrongPasswordFormat

/**
 * deny access if submitted password's format is wrong
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function wrongPasswordFormat (req, res, next) {
  let custErr = {
    origin: `${__filename}.${getFuncName(wrongPasswordFormat)}`,
    statusCode: 400,
    title: 'Illegal password length',
    message: `Valid passwords should be ${passwordLength.min} ~ ${
      passwordLength.max
    } in length`,
  }
  if (!('password' in req.body)) return next()
  let password = req.body.password
  return password.length < passwordLength.min ||
    password.length > passwordLength.max
    ? next(genCustErr(custErr))
    : next()
}
