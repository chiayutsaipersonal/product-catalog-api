const express = require('express')
// const favicon = require('serve-favicon')

// route handlers
const responseHandlers = require('../middlewares/responseHandlers')

const clientRouter = express.Router()

module.exports = { init }

function init (app) {
  app.use('/', clientRouter)
  // clientRouter.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  clientRouter.get('/', (req, res, next) => {
    req.resTemplate = {
      view: 'index',
      data: { title: 'Index Page' },
    }
    return next()
  })

  clientRouter.get('/admin', (req, res, next) => {
    req.resTemplate = {
      view: 'admin',
      data: { title: 'Admin page' },
    }
    return next()
  })

  clientRouter.use(responseHandlers.template)

  clientRouter.use('*', (req, res, next) => {
    let error = new Error(`Page requested is missing: '${req.originalUrl}'`)
    error.status = 404
    return next(error)
  })

  return Promise.resolve('Routing for app clients registered')
}
