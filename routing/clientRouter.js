const express = require('express')
const path = require('path')

const clientRouter = express.Router()

module.exports = { init }

function init (app) {
  app.use('/', clientRouter)

  clientRouter.get('/', (req, res, next) => {
    return res
      .status(200)
      .type('text/html;charset=utf-8')
      .sendFile(path.resolve('./dist/index.html'))
  })

  return Promise.resolve('Routing for app web client registered')
}
