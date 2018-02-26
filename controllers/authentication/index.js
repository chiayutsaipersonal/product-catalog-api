const passport = require('passport')

const loginStrategies = {
  users: require('./strategies/users'),
  admins: require('./strategies/admins'),
}

const adminsAndSpecificUsersPlugin = require('./validationPlugins/adminsAndSpecificUsers')
const adminsOnlyPlugin = require('./validationPlugins/adminsOnly')
const specificUsersPlugin = require('./validationPlugins/specificUsers')
const staffOrAbovePlugin = require('./validationPlugins/staffOrAbove')
const staffOrAboveAndSpecificUsersPlugin = require('./validationPlugins/staffOrAboveAndSpecificUsers')

const sessionSetting = { session: false }

module.exports = {
  authentication: authentication(),
  parseContactIdFromRequest,
}

function authentication () {
  // login strategies
  passport.use('users', loginStrategies.users)
  passport.use('admins', loginStrategies.admins)

  return {
    init: () => passport.initialize(),
    // custom verifications
    adminsAndSpecificUsers: (req, res, next) => {
      return passport.authenticate(
        'users',
        sessionSetting,
        adminsAndSpecificUsersPlugin(req, res, next)
      )(req, res, next)
    },
    adminsOnly: (req, res, next) => {
      return passport.authenticate(
        'admins',
        sessionSetting,
        adminsOnlyPlugin(req, res, next)
      )(req, res, next)
    },
    specificUsers: (req, res, next) => {
      return passport.authenticate(
        'users',
        sessionSetting,
        specificUsersPlugin(req, res, next)
      )(req, res, next)
    },
    staffOrAbove: (req, res, next) => {
      return passport.authenticate(
        'users',
        sessionSetting,
        staffOrAbovePlugin(req, res, next)
      )(req, res, next)
    },
    staffOrAboveAndSpecificUsers: (req, res, next) => {
      return passport.authenticate(
        'users',
        sessionSetting,
        staffOrAboveAndSpecificUsersPlugin(req, res, next)
      )(req, res, next)
    },
  }
}

/**
 * parse contactId from either req.params.contactId or req.body.contactId
 * @param {*} req
 */
function parseContactIdFromRequest (req) {
  return 'contactId' in req.params
    ? req.params.contactId.toUpperCase()
    : 'contactId' in req.body ? req.body.contactId.toUpperCase() : null
}
