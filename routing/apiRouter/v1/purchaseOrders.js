const purchaseOrderRouter = require('express').Router()

// middlewares
const notImplemented = require('routing/middlewares/notImplemented')
const routingTest = require('routing/middlewares/routingTest')

purchaseOrderRouter
  .route('/purchaseOrders/:purchaseOrderId')
  .get(routingTest) // get purchase order by id
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest) // cancel purchase order
  .delete(routingTest) // confirm PO cancellation

module.exports = purchaseOrderRouter
