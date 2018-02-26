const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

module.exports = getContactId

/**
 * get contactId of a specified property from the request object and place the value in 'req.contactId'.  'contactId' is expected to exist (even if it's a 'null' value), so all errors are generated with '500 internal error' statusCode
 * @param {*} param0
 */
function getContactId ({
  property = 'params',
  failIfNotFound = true,
  failIfUndeclared = true,
}) {
  return (req, res, next) => {
    let custErr = {
      origin: `${__filename}.${getFuncName(getContactId)}`,
      title: '\'contactId\' retrieval failure',
      statusCode: 500,
    }
    if (!req[property] || !req[property].contactId) {
      if (failIfUndeclared) {
        custErr.message = `'req.${property}.contactId' is undefined`
        return next(genCustErr(custErr))
      } else {
        req.contactId = null
        return next()
      }
    } else if (!req[property].contactId) {
      if (failIfNotFound) {
        custErr.message = 'Valid \'contactId\' not found'
        return next(genCustErr(custErr))
      } else {
        req.contactId = null
        return next()
      }
    } else {
      req.contactId = req[property].contactId
      return next()
    }
  }
}
