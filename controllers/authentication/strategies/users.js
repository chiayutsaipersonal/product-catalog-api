const passportJWT = require('passport-jwt')
const Strategy = passportJWT.Strategy

const params = {
  secretOrKey: require('config/authentication').jwtSecret,
  jwtFromRequest: passportJWT.ExtractJwt.fromHeader('x-access-token'),
  passReqToCallback: true,
}

const identifyUser = require('./identifyUser')

module.exports = new Strategy(params, identifyFunction)

function identifyFunction (req, credentials, done) {
  return identifyUser(credentials, done)
}
