const fs = require('fs-extra')
const multer = require('multer')
const path = require('path')
const piexifjs = require('piexifjs')
const Promise = require('bluebird')
const uuidV4 = require('uuid/v4')

const defaultSizeLimit = 1250000
const defaultCountLimit = 1

module.exports = {
  formDataOnly: multer().none(),
  multiImageUpload,
}

/**
 * get extension of a file
 * @param {*} fileName
 */
function getExt (fileName) {
  return fileName.split('.')[1]
}

/**
 * check if a file name has image extension
 * @param {*} fileName
 */
function hasImgExt (fileName) {
  return fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|bmp)$/)
}

/**
 *
 * @param {*} req
 * @param {*} file
 * @param {*} cb
 */
function imageFileFilter (req, file, cb) {
  let fileName = file.originalname
  let isImage = hasImgExt(fileName)
  if (!isImage) {
    let message = `Illegal file type detected: ${getExt(fileName)}`
    let error = new Error(message)
    return cb(error, false)
  }
  return cb(null, true)
}

/**
 * handle multiple image upload
 * @param {*} param0
 */
function multiImageUpload ({
  sizeLimit = defaultSizeLimit,
  countLimit = defaultCountLimit,
  destPath,
}) {
  return (req, res, next) => {
    let upload = multer({
      dest: null, // memory storage
      fileFilter: imageFileFilter,
      limits: { fileSize: sizeLimit },
    }).array('images', countLimit)
    upload(req, res, error => {
      if (error) return next(error)
      if (!req.files) return next()
      return Promise.each(req.files, file => {
        let id = uuidV4().toUpperCase()
        let fileName = `${id}.${getExt(file.originalname)}`
        return fs.outputFile(
          path.join(destPath, fileName),
          stripeExif(file.buffer)
        )
      })
        .then(() => {
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    })
  }
}

/**
 * remove exif data from buffered image data
 * @param {*} imageBuffer
 */
function stripeExif (imageBuffer) {
  try {
    return Buffer.from(
      piexifjs.remove(imageBuffer.toString('binary')),
      'binary'
    )
  } catch (e) {
    // no EXIF info cause exception
    // data is returned directly
    return imageBuffer
  }
}
