const logging = require('controllers/logging')

module.exports = db => {
  db.Companies = require('models/definitions/companies.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Contacts = require('models/definitions/contacts.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Countries = require('models/definitions/countries.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Labels = require('models/definitions/labels.js')(
    db.sequelize,
    db.Sequelize
  )
  db.OrderDetails = require('models/definitions/orderDetails.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Photos = require('models/definitions/photos.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Products = require('models/definitions/products.js')(
    db.sequelize,
    db.Sequelize
  )
  db.PurchaseOrders = require('models/definitions/purchaseOrders.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Series = require('models/definitions/series.js')(
    db.sequelize,
    db.Sequelize
  )
  db.TagGroups = require('models/definitions/tagGroups.js')(
    db.sequelize,
    db.Sequelize
  )
  db.Tags = require('models/definitions/tags.js')(db.sequelize, db.Sequelize)
  logging.console('Database models registered')
  return Promise.resolve(db)
}
