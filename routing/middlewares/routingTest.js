module.exports = routingTest

function routingTest (req, res, next) {
  req.resJson = { message: `${req.originalUrl} test successful` }
  return next()
}
