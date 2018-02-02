const multer = require('multer')

const authenticationRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const contactMiddlewares = require('../../middlewares/contacts')

// login by requesting a jwt with user credentials
authenticationRouter.route('/login') // jwt login
  .get(notImplemented)
  .post(
    multer().none(),
    contactMiddlewares.validatePasswordFormat,
    contactMiddlewares.accountDiscovery,
    contactMiddlewares.rejectPasswordlessAccounts,
    contactMiddlewares.checkPassword,
    contactMiddlewares.provideToken,
    contactMiddlewares.loginMessage)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = authenticationRouter
