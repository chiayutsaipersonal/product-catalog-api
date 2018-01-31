const express = require('express')

// route handlers
const authentication = require('../controllers/authentication')()
const responseHandlers = require('../middlewares/responseHandlers')
const contactApiHandlers = require('./api/contacts')
const testHandlers = require('./api/test')

const apiRouterV1 = express.Router()

module.exports = { init }

function init (app) {
  /* API routes specific global middlewares */
  app.use('/api/v1', apiRouterV1)
  apiRouterV1.use(authentication.initialize())
  /* API routes */
  apiRouterV1.param('contactId', contactApiHandlers.autoFindTarget)
  apiRouterV1.route('/login').post(...contactApiHandlers.login)
  apiRouterV1.route('/test/plain').get(...testHandlers.plain)
  apiRouterV1.route('/test/contacts/:contactId').get(...testHandlers.specificUser)
  apiRouterV1.route('/test/adminsOnly').get(...testHandlers.adminsOnly)

  /* post routing middlewares */
  apiRouterV1.use(responseHandlers.file)
  apiRouterV1.use(responseHandlers.image)
  apiRouterV1.use(responseHandlers.json)
  apiRouterV1.use((req, res, next) => {
    let error = new Error('Endpoint does not exist')
    error.status = 404
    return next(error)
  })
  apiRouterV1.use(responseHandlers.error)

  return Promise.resolve('API router registered')
}
