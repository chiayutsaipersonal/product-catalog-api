const logging = require('../controllers/logging')

module.exports = (error, req, res, next) => {
  logging.error(error, 'Global application error handler invoked')
  res.locals.message = error.message
  res.locals.error = req.app.get('env') === 'development' ? error : {}
  res.status(error.status || 500)
  res.render('error')
}
