const seriesRouter = require('express').Router()

// middlewares
const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

seriesRouter
  .route('/series')
  .get(routingTest) // get product listing by tree structure (root level)
  .post(routingTest) // insert new root series
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

seriesRouter
  .route('/series/:seriesId')
  .get(routingTest) // get product listing by tree structure (at specific series node)
  .post(routingTest) // insert new child series
  .put(notImplemented)
  .patch(routingTest) // patch series properties
  .delete(routingTest) // delete series by id

module.exports = seriesRouter
