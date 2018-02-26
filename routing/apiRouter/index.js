const express = require('express')

const genCustErr = require('controllers/index').genCustErr

// route handlers
const apiRouter = express.Router()
const apiV1Router = express.Router()
const apiV2Router = express.Router()
const apiV3Router = express.Router()

module.exports = { init }

function init (app) {
  // API routes specific global middlewares
  app.use('/api', apiRouter)
  apiRouter.use(
    require('controllers/authentication/index').authentication.init()
  )
  apiRouter.use('/v1', apiV1Router)
  apiRouter.use('/v2', apiV2Router)
  apiRouter.use('/v3', apiV3Router)

  // API routes
  apiV1Router.use('/', require('routing/apiRouter/v1/carousels'))
  apiV1Router.use('/', require('routing/apiRouter/v1/companies'))
  apiV1Router.use('/', require('routing/apiRouter/v1/contacts'))
  apiV1Router.use('/', require('routing/apiRouter/v1/countries'))
  apiV1Router.use('/', require('routing/apiRouter/v1/photos'))
  apiV1Router.use('/', require('routing/apiRouter/v1/products'))
  apiV1Router.use('/', require('routing/apiRouter/v1/purchaseOrders'))
  apiV1Router.use('/', require('routing/apiRouter/v1/series'))
  apiV2Router.use('/', require('routing/apiRouter/v2/series'))
  apiV3Router.use('/', require('routing/apiRouter/v3/series'))
  apiV1Router.use('/', require('routing/apiRouter/v2/tagGroups'))
  apiV1Router.use('/', require('routing/apiRouter/v1/tags'))

  // post routing middlewares
  apiRouter.use(require('routing/middlewares/responses/file'))
  apiRouter.use(require('routing/middlewares/responses/image'))
  apiRouter.use(require('routing/middlewares/responses/json'))
  apiRouter.use((req, res, next) => {
    return next(
      genCustErr({
        origin: __filename,
        statusCode: 404,
        title: 'API resource not found',
        message: 'Endpoint does not exist',
      })
    )
  })
  apiRouter.use(require('routing/middlewares/errorHandlers').api)

  return Promise.resolve('API router registered')
}
