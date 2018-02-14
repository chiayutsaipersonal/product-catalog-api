const companyRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

companyRouter.route('/hostingCompanies')
  .get(routingTest) // get hosting companies' information
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

companyRouter.route('/companies')
  .get(routingTest) // get company dataset
  .post(routingTest) // insert a company record
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

companyRouter.route('/companies/:companyId')
  .get(routingTest) // get one company record
  .post(notImplemented)
  .put(routingTest) // update company information
  .patch(notImplemented)
  .delete(routingTest) // delete a company

module.exports = companyRouter
