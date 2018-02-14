const productRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

productRouter.route('/products')
  .get(routingTest) // get product dataset
  .post(routingTest) // create new product record
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

productRouter.route('/products/:productId')
  .get(routingTest) // get product record by id
  .post(notImplemented)
  .put(routingTest) // update product
  .patch(routingTest) // patch product fields (seriesId)
  .delete(routingTest) // delete product by id

productRouter.route('/productSearch')
  .get(routingTest) // search product listing
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

module.exports = productRouter
