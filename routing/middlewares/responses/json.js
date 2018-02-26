const cannedResponses = {
  200: '200 OK',
  201: '201 Created',
  202: '202 Accepted',
  204: '204 No Content',
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  503: '503 Service Unavailable',
  505: '505 Permission Denied',
}

module.exports = jsonResponse

/**
 * send a json response when presence of req.resJson is detected
 * example:
 * res.status(200)
 * req.resJson = {
 *   // both properties are optional
 *   data: data,
 *   message: message,
 * }
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function jsonResponse (req, res, next) {
  if (!('resJson' in req)) return next()
  let resObj = req.resJson
  resObj.method = req.method.toLowerCase()
  resObj.endpoint = req.originalUrl
  resObj.statusCode = res.statusCode
  if (!('message' in resObj)) {
    resObj.message = cannedResponses[res.statusCode.toString()]
  }
  return res
    .status(res.statusCode || 200)
    .type('application/json;charset=utf-8')
    .json(resObj)
    .end()
}
