const companyRouter = require('express').Router()

// middlewares
// const validateStaffOrAbove = require('controllers/authentication/index').authentication.staffOrAbove

const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

companyRouter
  .route('/companies')
  .get(routingTest) // list companies
  .post(routingTest) // insert a company record
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

companyRouter
  .route('/companies/:companyId')
  .get(routingTest) // get one company record
  .post(notImplemented)
  .put(routingTest) // update company information
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = companyRouter
