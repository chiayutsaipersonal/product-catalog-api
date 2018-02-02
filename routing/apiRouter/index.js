const express = require('express')

// middlewares
const fileResponseHandler = require('../middlewares').file
const imageResponseHandler = require('../middlewares').image
const jsonResponseHandler = require('../middlewares').json
const errorResponseHandler = require('../middlewares').error

// route handlers
const authentication = require('../../controllers/authentication').authentication()

const apiRouter = express.Router()
const apiV1Router = express.Router()
const apiV2Router = express.Router()
const apiV3Router = express.Router()

module.exports = { init }

function init (app) {
  // API routes specific global middlewares
  app.use('/api', apiRouter)
  apiRouter.use('/v1', apiV1Router)
  apiRouter.use('/v2', apiV2Router)
  apiRouter.use('/v3', apiV3Router)
  apiV2Router.use(authentication.initialize())
  apiV3Router.use(authentication.initialize())

  // API routes
  apiV1Router.use('/', require('./v1/authentication'))
  apiV1Router.use('/', require('./v1/carousels'))
  apiV1Router.use('/', require('./v1/companies'))
  apiV1Router.use('/', require('./v1/contacts'))
  apiV1Router.use('/', require('./v1/countries'))
  apiV1Router.use('/', require('./v1/photos'))
  apiV1Router.use('/', require('./v1/products'))
  apiV1Router.use('/', require('./v1/purchaseOrders'))
  apiV1Router.use('/', require('./v1/series'))
  apiV2Router.use('/', require('./v2/series'))
  apiV3Router.use('/', require('./v3/series'))
  apiV1Router.use('/', require('./v2/tagGroups'))
  apiV1Router.use('/', require('./v1/tags'))

  // post routing middlewares
  apiRouter.use(fileResponseHandler)
  apiRouter.use(imageResponseHandler)
  apiRouter.use(jsonResponseHandler)
  apiRouter.use((req, res, next) => {
    let error = new Error('Endpoint does not exist')
    error.status = 404
    return next(error)
  })
  apiRouter.use(errorResponseHandler)

  return Promise.resolve('API router registered')
}
