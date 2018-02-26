const fs = require('fs-extra')

module.exports = deleteFile

/**
 * delete a file from the file system
 * file path is in req.deleteTargetPath
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function deleteFile (req, res, next) {
  return fs
    .remove(req.deleteTargetPath)
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
