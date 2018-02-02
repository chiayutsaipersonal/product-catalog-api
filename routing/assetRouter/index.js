const express = require('express')
const path = require('path')

const assetRouter = express.Router()

module.exports = { init }

function init (app) {
  // asset accessing routes specific global middlewares
  app.use('/assets', assetRouter)

  // static assets
  assetRouter.use(express.static(path.resolve('./public')))

  return Promise.resolve('Routing for assets registered')
}
