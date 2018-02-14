const carouselRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

carouselRouter.route('/carousels')
  .get(routingTest) // get carousel records
  .post(routingTest) // insert a carousel image
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
carouselRouter.route('/carousels/:carouselId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest) // update displaySequence
  .delete(routingTest) // remove a carousel image

module.exports = carouselRouter
