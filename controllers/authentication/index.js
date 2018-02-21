const passport = require('passport')

const loginStrategies = {
  users: require('./strategies/users'),
  admins: require('./strategies/admins'),
}

const verifications = {
  specificUser: require('./verifications/specificUser'),
  staffOrAbove: require('./verifications/staffOrAbove'),
  adminsOnly: require('./verifications/adminsOnly'),
}

module.exports = authentication()

function authentication () {
  // login strategies
  passport.use('users', loginStrategies.users)
  passport.use('admins', loginStrategies.admins)

  return {
    initialize: () => passport.initialize(),
    // custom verifications
    specificUser: (req, res, next) => {
      return passport.authenticate(
        'users',
        { session: false },
        verifications.specificUser(req, res, next)
      )(req, res, next)
    },
    staffOrAbove: (req, res, next) => {
      return passport.authenticate(
        'users',
        { session: false },
        verifications.staffOrAbove(req, res, next)
      )(req, res, next)
    },
    adminsOnly: (req, res, next) => {
      return passport.authenticate(
        'admins',
        { session: false },
        verifications.adminsOnly(req, res, next)
      )(req, res, next)
    },
  }
}
