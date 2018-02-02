const jwt = require('jsonwebtoken')

// controllers
const logging = require('../../controllers/logging')

// queries
const getCredentialByEmail = require('../../models/queries/contacts').getCredentialByEmail

const PASS_PHRASE = require('../../config/authentication').jwtSecret
const ENFORCE_VALIDATION = require('../../config/authentication').enforced

module.exports = {
  validateJwt,
}

/*
middleware to validate jwt in the incoming requests
for v1 routes
restrictionLevel is an object
{ // parameters are all optional, defaults to general account comparison by email only
  none: true/false, // skips validation entirely, used on routes that's openly accessable to public (other restrictions will be ignored)
  admin: true/false, // account found by email lookup must has true as admin field value (staff and user restrictions will be ignored)
  staff: true/false, // accounts registered under hosting companies
  user: true/false // matches token payload id to account id found by query email, also need to match req.params.contactId
}
*/
function validateJwt ({ none = false, admin = false, staff = false, user = false } = {}) {
  return (req, res, next) => {
    // skip validation if specified in the .env file
    if (!ENFORCE_VALIDATION) {
      logging.warning('SYSTEM IS CONFIGURED TO SKIP ALL TOKEN VALIDATION !!!')
      return next()
    }

    // skip validation if specified by the server code
    if (none) return next()

    // check if token exists in the request header
    let accessToken = req.get('x-access-token')
    if (!accessToken) {
      let error = new Error('Missing Token')
      error.status = 401
      return next(error)
    }

    // decode token and verify against restriction settings
    return jwt.verify(accessToken, PASS_PHRASE, (error, decodedToken) => {
      if (error) { // token cannot be decoded
        error.status = 401
        return next(error)
      }

      // token decoded, search contact list for account that at least matches in email
      return getCredentialByEmail()
        .then(contact => {
          // token carries an email that's not registered in the contact records
          if (!contact) {
            let error = new Error('Cannot validate the provided credentials')
            error.status = 401
            next(error)
            return Promise.resolve()
          }

          // determine and set user privilege level
          let privilege = req.userPrivilege = contact.admin ? 3 : contact.company.host ? 2 : 1
          req.registeredUser = contact

          // matching account has admin privilege, allow access immediately
          if (privilege === 3) {
            next()
            return Promise.resolve()
          }

          // if admin privilege is required
          if (admin && (privilege < 3)) {
            let error = new Error('Only admin accounts are authorized')
            error.status = 403
            next(error)
            return Promise.resolve()
          }

          // only staff is allowed
          if (staff && !user && (privilege < 2)) {
            let error = new Error('Only hosting company\'s staff accounts are authorizded')
            error.status = 403
            next(error)
            return Promise.resolve()
          }

          // if only user is allowed
          if (user && !staff) {
            // prevent staff account accessing private user features
            if (privilege === 2) {
              let error = new Error('Private user features are not accessible to staff accounts')
              error.status = 403
              next(error)
              return Promise.resolve()
            }
            // check user account
            if (privilege === 1) {
              // parse contactId from either req.params or req.body
              let parsedContactId = 'contactId' in req.params
                ? req.params.contactId.toUpperCase()
                : 'contactId' in req.body
                  ? req.body.contactId.toUpperCase()
                  : null

              // contactId parsed from payload does not match request designated contactId
              if (decodedToken.id !== parsedContactId) {
                let error = new Error('Attempt to access other user\'s information')
                error.status = 403
                next(error)
                return Promise.resolve()
              }

              // token payload contactId does not match the account id
              if (decodedToken.id !== contact.id) {
                let error = new Error('Token tempering detected')
                error.status = 401
                next(error)
                return Promise.resolve()
              }

              // make sure the user is a client account
              if ((contact.companyId !== null) && (contact.company.host !== false)) {
                let error = new Error('Only client account is allowed access')
                error.status = 401
                next(error)
                return Promise.resolve()
              }
            }
          }
          // all restriction had been applied or only general privilege is required
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    })
  }
}
