const seriesRouter = require('express').Router()

// middlewares
const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

seriesRouter
  .route('/series')
  .get(routingTest) // get full series menu structure (plain series object without association info)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

seriesRouter
  .route('/series/:seriesId')
  .get(routingTest) // get series by id and its associated product information
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest)
  .delete(routingTest)

module.exports = seriesRouter
