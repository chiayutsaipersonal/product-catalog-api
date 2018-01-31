const authentication = require('../../controllers/authentication')()

module.exports = {
  plain: [plain],
  specificUser: [
    authentication.specificUser,
    specificUser,
  ],
  adminsOnly: [
    authentication.adminsOnly,
    adminsOnly,
  ],
}

function plain (req, res, next) {
  req.resJson = { message: 'plain route access success' }
  return next()
}

function specificUser (req, res, next) {
  req.resJson = {
    data: {
      targetContactId: req.targetContactId,
      targetContact: req.targetContact,
    },
  }
  return next()
}

function adminsOnly (req, res, next) {
  req.resJson = {
    message: 'admin only route access success',
    data: {
      userPrivilege: req.userPrivilege,
      registeredUser: req.registeredUser,
    },
  }
  return next()
}
