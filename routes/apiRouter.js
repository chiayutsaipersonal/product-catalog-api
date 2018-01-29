const express = require('express')

const apiRouterV1 = express.Router()

// route handlers
const apiResponseHandlers = require('../middlewares/apiResponseHandlers')
const test = require('./api/test')

module.exports = { init }

function init (app) {
  /* API routes */
  app.use('/api/v1', apiRouterV1)
  apiRouterV1.route('/test').get(test)

  /* post routing middlewares */
  apiRouterV1.use(apiResponseHandlers.file)
  apiRouterV1.use(apiResponseHandlers.image)
  apiRouterV1.use(apiResponseHandlers.json)
  apiRouterV1.use((req, res, next) => {
    let error = new Error('Endpoint does not exist')
    error.status = 404
    return next(error)
  })
  apiRouterV1.use(apiResponseHandlers.error)

  return Promise.resolve('API router registered')
}
