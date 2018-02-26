const path = require('path')

module.exports = fileResponse

/**
 * send a file response when presence of req.resFile is detected
 * res.status(200)
 * req.resFile = {
 *   mimeType: 'image/jpeg',
 *   // must be absolute path
 *   filePath: path.resolve('./somePath/example.jpg'),
 * }
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function fileResponse (req, res, next) {
  return !('resFile' in req)
    ? next()
    : res
      .status(res.statusCode || 200)
      .type(req.resFile.mimeType)
      .attachment()
      .sendFile(path.resolve(req.resFile.filePath))
}
