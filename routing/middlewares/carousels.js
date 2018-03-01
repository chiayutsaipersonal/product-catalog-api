const fs = require('fs-extra')

const destination = require('config/app').carouselPhotoLocation

// const genCustErr = require('controllers/index').genCustErr
// const getFuncName = require('controllers/index').getFuncName

module.exports = {
  listCarousels,
  // processUploadedCarousels,
}

/**
 * list available carousel files in './dist/assets/img/carousels' folder
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function listCarousels (req, res, next) {
  return fs
    .readdir(destination)
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

/**
 * handle multi-image upload with multer (in memory)
 * including removal of exif information from the upload images
 * handles upload errors
 * find the next available integer id for new carousel image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * returns an array of available carousel image file names
 * or if no file uploads detected, returns a message only
 */
// function processUploadedCarousels (req, res, next) {
//   multipleImageFiles(req, res, error => {
//     if (error) {
//       let origin = `${__filename}.${getFuncName(processUploadedCarousels)}`
//       if (error.code === 'LIMIT_UNEXPECTED_FILE') {
//         let title = 'Upload count exceeded'
//         return next(genCustErr({ origin, statusCode: 400, title }))
//       } else {
//         return next(error)
//       }
//     }
//     if (!req.files) {
//       req.resJson = { message: 'No image uploaded' }
//       next()
//       return Promise.resolve()
//     }
//     return Promise.each(req.files, file => {
//       let id = uuidV4().toUpperCase()
//       let fileName = `${id}.${getFileExtension(file.originalname)}`
//       let destPath = path.join(destination, fileName)
//       return fs.outputFile(destPath, processExif(file.buffer))
//     })
//       .then(() => fs.readdir(destination))
//       .then(data => {
//         let message = 'Carousel image upload success'
//         req.resJson = { data, message }
//         return next()
//       })
//       .catch(error => next(error))
//   })
// }
