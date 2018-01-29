const express = require('express')
// const favicon = require('serve-favicon')

const clientRouter = express.Router()

module.exports = { init }

function init (app) {
  app.use('/', clientRouter)
  // clientRouter.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  clientRouter.get('/', (req, res, next) => {
    res.render('index', { title: 'Index page' })
  })

  clientRouter.get('/admin', (req, res, next) => {
    res.render('admin', { title: 'Admin page' })
  })

  clientRouter.use('*', (req, res, next) => {
    let error = new Error(`Page requested is missing: '${req.originalUrl}'`)
    error.status = 404
    return next(error)
  })

  return Promise.resolve('Routing for app clients registered')
}
