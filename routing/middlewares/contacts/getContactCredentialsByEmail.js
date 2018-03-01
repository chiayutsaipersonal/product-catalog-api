const db = require('controllers/database/index').db()
const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const findOne = require('models/queries/index').findOne

module.exports = getContactCredentialsByEmail

/**
 * get contact credentials by email lookup.  Email is retrieved from req[property].  Also denies access according to parameter settings
 * @param {*} param0
 */
function getContactCredentialsByEmail ({
  property = 'body',
  failIfNotFound = false,
  failIfFound = false,
  failIfUndeclared = true,
}) {
  return (req, res, next) => {
    let origin = `${__filename}.${getFuncName(getContactCredentialsByEmail)}`
    let custErr = { origin }
    let email = !req[property]
      ? undefined
      : !req[property].email
        ? undefined
        : req[property].email.toLowerCase() || null
    if (email === undefined) {
      if (failIfUndeclared) {
        custErr.statusCode = 500
        custErr.title = 'Missing property'
        custErr.message = `'req.${property}.email' is undefined`
        return next(genCustErr(custErr))
      } else {
        req.contact = null
        return next()
      }
    }
    if (email === null) {
      if (failIfNotFound) {
        custErr.statusCode = 500
        custErr.title = 'Unregistered contact'
        custErr.message = `Contact does not exist (email: ${email})`
        return next(genCustErr(custErr))
      } else {
        req.contact = null
        return next()
      }
    } else {
      let model = db.Contacts.scope({ method: ['credentialsOnly'] })
      let criteria = { email }
      return findOne({ model, criteria })
        .then(contactCredentials => {
          if (!contactCredentials && failIfNotFound) {
            custErr.statusCode = 500
            custErr.title = 'Unregistered contact'
            custErr.message = `Contact does not exist (email: ${email})`
            return next(genCustErr(custErr))
          }
          if (contactCredentials && failIfFound) {
            custErr.statusCode = 400
            custErr.title = 'Email not valid'
            custErr.message = 'This email address is already registered'
            return next(genCustErr(custErr))
          }
          req.contact = contactCredentials
          next()
          return Promise.resolve()
        })
        .catch(error => {
          error.origin = custErr.origin
          return next(error)
        })
    }
  }
}
