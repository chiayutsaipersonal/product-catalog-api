const companyRouter = require('express').Router()

// middlewares
const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

companyRouter
  .route('/regions')
  .get(routingTest) // get world regions
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

companyRouter
  .route('/countries')
  .get(routingTest) // get countries
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

companyRouter
  .route('/countries/:countryId')
  .get(routingTest) // get flag of a country
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = companyRouter
