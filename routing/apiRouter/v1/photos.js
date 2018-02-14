const photoRouter = require('express').Router()

// middlewares
const notImplemented = require('../../middlewares').notImplemented
const routingTest = require('../../middlewares').routingTest

photoRouter.route('/photos')
  .get(notImplemented)
  .post(routingTest) // photo bulk uploads
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

photoRouter.route('/photos/:photoId')
  .get(routingTest) // get photo image by id
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest) // update record field (isPrimary, seriesId, productId)
  .delete(routingTest) // delete photo record and image file by id

photoRouter.route('/orphanPhotos')
  .get(routingTest) // get orphan photos
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // assign orphan photos to a series or product
  .delete(notImplemented) // remove all orphan photos

photoRouter.route('/primaryPhotos')
  .get(notImplemented)
  .post(notImplemented)
  .put(routingTest) // insert a new photo and assign as primary photo to a product
  .patch(notImplemented)
  .delete(notImplemented)

photoRouter.route('/primaryPhotos/:photoId/products/:productId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(routingTest) // associate an existing photo to a product and assign as the primary
  .delete(notImplemented)

module.exports = photoRouter
