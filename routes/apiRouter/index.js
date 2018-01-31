const express = require('express')

// route handlers
const authentication = require('../../controllers/authentication')()
const responseHandlers = require('../../middlewares/responseHandlers')

const apiRouterV1 = express.Router()

module.exports = {
  init,
  apiRouterV1,
}

function init (app) {
  /* API routes specific global middlewares */
  app.use('/api/v1', apiRouterV1)
  apiRouterV1.use(authentication.initialize())

  /* API routes */
  require('./contacts') // contact related routes

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
