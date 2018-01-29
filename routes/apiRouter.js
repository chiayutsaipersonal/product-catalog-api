const express = require('express')

// route handlers
const responseHandlers = require('../middlewares/responseHandlers')
const test = require('./api/test')

const apiRouterV1 = express.Router()

module.exports = { init }

function init (app) {
  /* API routes */
  app.use('/api/v1', apiRouterV1)
  apiRouterV1.route('/test').get(test)

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
