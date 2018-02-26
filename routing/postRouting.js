module.exports = {
  init: app => {
    // global 404 handler
    app.use(require('routing/middlewares/pageNotFound'))

    // global routing error handler
    app.use(require('routing/middlewares/errorHandlers').global)

    return Promise.resolve('Global post-routing middlewares registered')
  },
}
