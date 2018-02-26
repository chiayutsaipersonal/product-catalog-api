const carouselRouter = require('express').Router()
const path = require('path')

const carouselPhotoLocation = require('config/app').carouselPhotoLocation
const limit = require('config/app').imageUploadLimit

// middlewares
const deleteFile = require('routing/middlewares/deleteFile')
const listCarousels = require('routing/middlewares/carousels').listCarousels
const multiImageUpload = require('routing/middlewares/multer').multiImageUpload(
  {
    sizeLimit: limit.fileSize,
    countLimit: limit.count,
    destPath: carouselPhotoLocation,
  }
)

const validateStaffOrAbove = require('controllers/authentication/index')
  .authentication.staffOrAbove

carouselRouter
  .route('/carousels')
  .get(
    // get available carousel list
    listCarousels
  )
  .post(
    // upload a carousel image
    validateStaffOrAbove,
    multiImageUpload,
    listCarousels
  )

// remove a carousel image
carouselRouter.route('/carousels/:fileName').delete(
  validateStaffOrAbove,
  (req, res, next) => {
    req.deleteTargetPath = path.join(carouselPhotoLocation, req.params.fileName)
    return next()
  },
  deleteFile,
  listCarousels
)

module.exports = carouselRouter
