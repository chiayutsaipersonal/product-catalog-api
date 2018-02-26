const tagGroupRouter = require('express').Router()

// middlewares
const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

tagGroupRouter
  .route('/')
  .get(routingTest)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = tagGroupRouter
