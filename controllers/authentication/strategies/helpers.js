const contactQueries = require('../../../models/queries/contacts')
const getCredentialByEmail = contactQueries.getCredentialByEmail

module.exports = {
  identifyUser: (credentials, done) => {
    return getCredentialByEmail(credentials.email)
      .then(contact => {
        if (!compareCredentials(credentials, contact)) {
          let error = new Error('Unidentified credentials')
          error.status = 401
          return done(error)
        }
        return done(null, contact)
      })
      .catch(error => done(error))
  },
}

function compareCredentials (credentials, account) {
  return (
    credentials.id === account.id &&
    credentials.name === account.name &&
    credentials.email === account.email
  )
}
