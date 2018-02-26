const db = require('controllers/database/index').db()

const genCustErr = require('controllers/index').genCustErr
const getFuncName = require('controllers/index').getFuncName

const findOne = require('models/queries/index').findOne

module.exports = identifyUser

function compareCredentials (credentials, account) {
  let id = credentials.id === account.id
  let name = credentials.name === account.name
  let email = credentials.email === account.email
  return id && name && email
}

function identifyUser (credentials, done) {
  let custErr = {
    origin: `${__filename}.${getFuncName(identifyUser)}`,
    statusCode: 401,
    title: 'Unauthorized',
  }
  let model = db.Contacts.scope({ method: ['credentialsOnly'] })
  let criteria = { email: credentials.email }
  return findOne({ model, criteria })
    .then(contact => {
      if (!contact) {
        custErr.message = 'Account not found'
        return Promise.reject(genCustErr(custErr))
      }
      if (!compareCredentials(credentials, contact)) {
        custErr.message = 'Credentials not recognized'
        return Promise.reject(genCustErr(custErr))
      }
      done(null, contact)
      return Promise.resolve()
    })
    .catch(error => done(error))
}
