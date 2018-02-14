const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')

const assetRouter = express.Router()

module.exports = { init }

function init (app) {
  app.use(favicon(path.resolve('./dist/favicon.ico')))
  app.use('/static', assetRouter)
  assetRouter.use('/', express.static(path.resolve('./dist/static')))

  return Promise.resolve('Routing for assets registered')
}
