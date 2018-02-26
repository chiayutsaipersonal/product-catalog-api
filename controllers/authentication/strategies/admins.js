const passportJWT = require('passport-jwt')
const Strategy = passportJWT.Strategy

const genCustErr = require('controllers/index').genCustErr

const params = {
  secretOrKey: require('config/authentication').jwtSecret,
  jwtFromRequest: passportJWT.ExtractJwt.fromHeader('x-access-token'),
  passReqToCallback: true,
}

const identifyUser = require('controllers/authentication/index').identifyUser

module.exports = new Strategy(params, identifyFunction)

function identifyFunction (req, credentials, done) {
  if (!credentials.admin) {
    let custErr = {
      origin: __filename,
      statusCode: 401,
      title: 'Admin privilege required',
    }
    return done(genCustErr(custErr))
  }
  return identifyUser(credentials, done)
}
