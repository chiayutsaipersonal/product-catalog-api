const passport = require('passport')
const passportJWT = require('passport-jwt')

const config = require('../config/authentication')

const contactQueries = require('../models/queries/contacts')

const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
  passReqToCallback: true,
}

module.exports = function () {
  let specificUser = new Strategy(params, (req, payload, done) => {
    return identifyContact(payload, done)
  })
  let staffOrAbove = new Strategy(params, (req, payload, done) => {
    return identifyContact(payload, done)
  })
  let adminsOnly = new Strategy(params, (req, payload, done) => {
    if (!payload.admin) return done(new Error('Admin privileg required'))
    return identifyContact(payload, done)
  })
  passport.use('specificUser', specificUser)
  passport.use('staffOrAbove', staffOrAbove)
  passport.use('adminsOnly', adminsOnly)
  return {
    initialize: () => passport.initialize(),
    specificUser: (req, res, next) => {
      return passport.authenticate(
        'specificUser',
        { session: false },
        specificUserCustomCallback(req, res, next)
      )(req, res, next)
    },
    staffOrAbove: (req, res, next) => {
      return passport.authenticate(
        'staffOrAbove',
        { session: false },
        staffOrAboveCustomCallback(req, res, next)
      )(req, res, next)
    },
    adminsOnly: (req, res, next) => {
      return passport.authenticate(
        'adminsOnly',
        { session: false },
        adminsOnlyCustomCallback(req, res, next)
      )(req, res, next)
    },
  }
}

function identifyContact (token, done) {
  return contactQueries
    .getCredentialByEmail(token.email)
    .then(contact => {
      if (!compareCredentials(token, contact)) {
        let error = new Error('Credential mismatch')
        error.status = 401
        return done(error)
      }
      return done(null, contact)
    })
    .catch(error => done(error))
}

function compareCredentials (token, account) {
  return (
    (token.id === account.id) &&
    (token.name === account.name) &&
    (token.email === account.email)
  )
}

function specificUserCustomCallback (req, res, next) {
  return (error, contact, info) => {
    if (error || info) {
      let customError = error || new Error(info)
      customError.status = !error ? 400 : !error.status ? 400 : error.status
      return next(customError)
    }
    if (!contact) {
      let customError = new Error('Cannot validate the provided credentials')
      customError.status = 401
      return next(customError)
    } else {
      // parse contactId from either req.params or req.body
      let parsedContactId = 'contactId' in req.params
        ? req.params.contactId.toUpperCase()
        : 'contactId' in req.body
          ? req.body.contactId.toUpperCase()
          : null
      // if contact id is not found by the request then error out
      // doesn't make sense to restric specific user access if the route
      // does not have user identifying properties
      if (!parsedContactId) {
        let customError = new Error('Required \'contactId\' is missing')
        customError.status = 400
        return next(customError)
      }
      // contact's id in database does not match the identifying property of the request
      if (contact.id !== parsedContactId) {
        let customError = new Error('Private route access restricted')
        customError.status = 403
        return next(customError)
      }
      // check for the following and block access - make sure only a customer can obtain access
      // account is not associated with any 'company' records
      // account's associated company should not be hosting company
      if ((!contact.company) || ((contact.company.Id !== null) && (contact.company.host))) {
        let customError = new Error('Only customers are allowed access')
        customError.status = 401
        return next(customError)
      }
      return next()
    }
  }
}

function staffOrAboveCustomCallback (req, res, next) {
  return (error, contact, info) => {
    if (error || info) {
      let customError = error || new Error(info)
      customError.status = !error ? 400 : !error.status ? 400 : error.status
      return next(customError)
    }
    if (!contact) {
      let customError = new Error('Cannot validate the provided credentials')
      customError.status = 401
      return next(customError)
    } else {
      // allow admin access immediately
      if (contact.admin) return next()
      // allow access if account is associated with 'hosting' company
      if (contact.company.host) return next()
      // otherwise, block access
      let customError = new Error('Only hosting company staffs are authorizded')
      customError.status = 403
      return next(customError)
    }
  }
}

function adminsOnlyCustomCallback (req, res, next) {
  return (error, contact, info) => {
    if (error || info) {
      let customError = error || new Error(info)
      customError.status = !error ? 400 : !error.status ? 400 : error.status
      return next(customError)
    }
    if (!contact) {
      let customError = new Error('Cannot validate the provided credentials')
      customError.status = 401
      return next(customError)
    } else {
      // allow admin access
      if (contact.admin) return next()
      // otherwise block access
      let customError = new Error('Only admin accounts are authorized')
      customError.status = 403
      return next(customError)
    }
  }
}
