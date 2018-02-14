const contactRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

contactRouter.route('/contactSearch')
  .get(routingTest) // search for contacts
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

contactRouter.route('/contacts')
  .get(notImplemented)
  .post(routingTest) // register a contact
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

contactRouter.route('/contacts/:contactId')
  .get(routingTest) // get a contact record by id
  .post(notImplemented)
  .put(routingTest) // update a contact
  .patch(notImplemented)
  .delete(routingTest) // delete a contact record by id

contactRouter.route('/contacts/:contactId/purchaseOrders')
  .get(notImplemented)
  .post(routingTest) // insert new purchase order
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = contactRouter
