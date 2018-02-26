const exphbs = require('express-handlebars')
const path = require('path')

module.exports = app => {
  app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.resolve('./views/layouts'),
      partialsDir: path.resolve('./views/partials'),
    })
  )
  app.set('view engine', '.hbs')
  app.set('views', path.resolve('./views'))
  app.set('layouts', path.resolve('./views/layouts'))
  app.set('partials', path.resolve('./views/partials'))
  return Promise.resolve('Handlebars view engine ready')
}
