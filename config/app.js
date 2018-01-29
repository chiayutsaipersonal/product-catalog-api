module.exports = {
  mode: process.env.NODE_ENV === 'development',
  port: normalizePort(process.env.PORT || '9004'),
  reference: 'sauTian',
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}
