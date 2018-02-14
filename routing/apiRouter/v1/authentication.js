const multer = require('multer')

const authenticationRouter = require('express').Router()

// middlewares
const contacts = require('../../middlewares/contacts')
const notImplemented = require('../../middlewares').notImplemented

// login by requesting a jwt with user credentials
authenticationRouter.route('/login') // jwt login
  .get(notImplemented)
  .post(
    multer().none(),
    contacts.validatePasswordFormat,
    contacts.accountDiscovery,
    contacts.rejectPasswordlessAccounts,
    contacts.checkPassword,
    contacts.provideToken,
    contacts.loginMessage)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = authenticationRouter
