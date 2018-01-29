module.exports = {
  mode: process.env.NODE_ENV === 'development',
  port: normalizePort(process.env.PORT || '9004'),
  reference: 'gentryWay',
  title: '仲群維企業有限公司',
}

function normalizePort (val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}
