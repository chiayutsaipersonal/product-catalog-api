module.exports = notImplemented

function notImplemented (req, res, next) {
  let error = new Error('Not implemented')
  error.status = 501
  return next(error)
}
