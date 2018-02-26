module.exports = imageResponse

/**
 * send an image response when presence of req.resImage is detected
 * res.status(200)
 * req.resImage = {
 *   mimeType: 'image/jpeg',
 *   data: new Buffer('./someImage.jpg'),
 * }
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function imageResponse (req, res, next) {
  return !('resImage' in req)
    ? next()
    : res
      .status(res.statusCode || 200)
      .type(req.resImage.mimeType)
      .send(req.resImage.data)
      .end()
}
