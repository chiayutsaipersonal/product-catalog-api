const logging = require('../controllers/logging')

module.exports = (error, req, res, next) => {
  logging.error(error, 'Global application error handler invoked')
  if (error.status === 404) {
    return res
      .status(302)
      .type('text/html;charset=utf-8')
      .render('index', { title: 'Index Page' })
  } else {
    res.locals.message = error.message
    res.locals.error = req.app.get('env') === 'development' ? error : {}
    res.status(error.status || 500)
    return res.render('error')
  }
}
