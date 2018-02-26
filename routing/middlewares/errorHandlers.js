const path = require('path')

const prodMode = require('config/app').prodMode

const logging = require('controllers/logging')

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

module.exports = {
  api: apiErrorHandler,
  global: globalErrorHandler,
}

/**
 * router specific global api error handler
 * @param {*} error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function apiErrorHandler (error, req, res, next) {
  logging.error(error, 'Global API error handler invoked')
  if (error.statusCode) res.status(error.statusCode)
  res.status(res.statusCode >= 400 ? res.statusCode : 500)
  let resJson = {
    method: req.method.toLowerCase(),
    endpoint: req.originalUrl,
    message:
      'customMessage' in error || 'message' in error
        ? error.customMessage || error.message
        : cannedResponses[res.statusCode.toString()],
  }
  resJson.error = {
    status: res.statusCode,
    code: error.code,
    name: error.name,
    origin: error.origin,
    message: error.message,
  }
  if (!prodMode) resJson.error.stack = error.stack
  return res.type('application/json;charset=utf-8').json(resJson)
}

/**
 * global routing error handler
 * @param {*} error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function globalErrorHandler (error, req, res, next) {
  logging.error(error, 'Global application error handler invoked')
  if (error.statusCode === 404) {
    return res
      .status(301)
      .type('text/html;charset=utf-8')
      .sendFile(path.resolve('./dist/index.html'))
  } else {
    res.locals.message = error.message
    res.locals.error = req.app.get('env') === 'development' ? error : {}
    res.status(error.statusCode || 500)
    return res.render('error')
  }
}
