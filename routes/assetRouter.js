const express = require('express')
const path = require('path')

const assetRouter = express.Router()

module.exports = { init }

function init (app) {
  app.use('/assets', assetRouter)
  assetRouter.use(express.static(path.resolve('./public')))
  return Promise.resolve('Routing for assets registered')
}
