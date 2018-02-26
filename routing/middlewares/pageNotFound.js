module.exports = pageNotFound

function pageNotFound (req, res, next) {
  let error = new Error(`Page requested is missing: '${req.originalUrl}'`)
  error.status = 404
  return next(error)
}
