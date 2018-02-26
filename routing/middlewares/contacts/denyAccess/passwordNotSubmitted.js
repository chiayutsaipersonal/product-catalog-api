const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = passwordNotSubmitted

/**
 * deny access if no password was submitted through req.body
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function passwordNotSubmitted (req, res, next) {
  let custErr = {
    origin: `${__filename}.${getFuncName(passwordNotSubmitted)}`,
    statusCode: 400,
    title: 'Forbidden',
    message: 'Password was not submitted',
  }
  return req.body.password ? next() : next(genCustErr(custErr))
}
