const logging = require('../controllers/logging')

module.exports = {
  init: app => {
    // global 404 handler
    app.use((req, res, next) => {
      let error = new Error(`Page requested is missing: '${req.originalUrl}'`)
      error.status = 404
      return next(error)
    })

    // global routing error handler
    app.use((error, req, res, next) => {
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
    })

    return Promise.resolve('Global post-routing middlewares registered')
  },
}
