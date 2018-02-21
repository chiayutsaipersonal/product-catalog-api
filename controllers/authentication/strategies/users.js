const passportJWT = require('passport-jwt')

const authConfig = require('../config/authentication')

const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy

const params = {
  secretOrKey: authConfig.jwtSecret,
  jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
  passReqToCallback: true,
}

const identifyUser = require('./helpers').identifyUser

module.exports = new Strategy(params, (req, credentials, done) => {
  return identifyUser(credentials, done)
})
