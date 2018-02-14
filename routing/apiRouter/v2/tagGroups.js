const tagGroupRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

tagGroupRouter.route('/')
  .get(routingTest)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = tagGroupRouter
