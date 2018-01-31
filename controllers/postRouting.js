const appErrorHandler = require('../middlewares/appErrorHandler')

module.exports = {
  init: app => {
    // global routing error handler
    app.use(appErrorHandler)

    // global 404 handler
    app.use('*', (req, res, next) => {
      let error = new Error(`Page requested is missing: '${req.originalUrl}'`)
      error.status = 404
      return next(error)
    })

    return Promise.resolve('Global post-routing middlewares registered')
  },
}
