const seriesRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

seriesRouter.route('/series')
  .get(routingTest) // get root level series menu
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

seriesRouter.route('/series/:seriesId')
  .get(routingTest) // get series menu at a particular node and tagMenu plus products
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = seriesRouter
