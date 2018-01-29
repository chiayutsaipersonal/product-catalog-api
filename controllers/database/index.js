const fileExists = require('file-exists')
const fs = require('fs-extra')
const path = require('path')
const Sequelize = require('sequelize')

const dbConfig = require('../../config/database')

const logging = require('../../controllers/logging')

const sequelize = new Sequelize(dbConfig)

const db = {
  sequelize,
  Sequelize,
  Companies: require('../../models/definitions/companies.js')(sequelize, Sequelize),
  Contacts: require('../../models/definitions/contacts.js')(sequelize, Sequelize),
  Countries: require('../../models/definitions/countries.js')(sequelize, Sequelize),
  Labels: require('../../models/definitions/labels.js')(sequelize, Sequelize),
  OrderDetails: require('../../models/definitions/orderDetails.js')(sequelize, Sequelize),
  Photos: require('../../models/definitions/photos.js')(sequelize, Sequelize),
  Products: require('../../models/definitions/products.js')(sequelize, Sequelize),
  PurchaseOrders: require('../../models/definitions/purchaseOrders.js')(sequelize, Sequelize),
  Series: require('../../models/definitions/series.js')(sequelize, Sequelize),
  TagGroups: require('../../models/definitions/tagGroups.js')(sequelize, Sequelize),
  Tags: require('../../models/definitions/tags.js')(sequelize, Sequelize),
}

module.exports = {
  db,
  init,
  create,
}

function create () {
  return fs.ensureDir(path.resolve('./data'))
    .then(() => fs.remove(path.resolve(dbConfig.storage)))
    .then(() => verify())
    .then(() => forcedSyncModels())
    .then(() => establishAssociations())
    .then(() => forcedSyncModels())
    .catch(error => {
      logging.error(error, 'Database creation failure')
      return Promise.reject(error)
    })
}

function sync () {
  return verify()
    .then(() => syncModels())
    .then(() => establishAssociations())
    .then(() => syncModels())
    .catch(error => {
      logging.error(error, 'Database synchronization failure')
      return Promise.reject(error)
    })
}

function init () {
  return fileExists(path.resolve(dbConfig.storage))
    .then(existence => existence ? sync() : create())
    .then(() => Promise.resolve('Database initialization completed'))
    .catch(error => {
      logging.error(error, 'Database initialization failure')
      return Promise.reject(error)
    })
}

function verify () {
  return sequelize
    .authenticate()
    .catch(error => {
      logging.error(error, 'Database verification failure')
      return Promise.reject(error)
    })
}

function forcedSyncModels () {
  return db.Companies.sync({ force: true })
    .then(() => db.Contacts.sync({ force: true }))
    .then(() => db.Countries.sync({ force: true }))
    .then(() => db.Labels.sync({ force: true }))
    .then(() => db.OrderDetails.sync({ force: true }))
    .then(() => db.Photos.sync({ force: true }))
    .then(() => db.Products.sync({ force: true }))
    .then(() => db.PurchaseOrders.sync({ force: true }))
    .then(() => db.Series.sync({ force: true }))
    .then(() => db.TagGroups.sync({ force: true }))
    .then(() => db.Tags.sync({ force: true }))
    .catch(error => {
      logging.error(error, 'Data table synchronization failure')
      return Promise.reject(error)
    })
}

function syncModels () {
  return db.Companies.sync()
    .then(() => db.Contacts.sync())
    .then(() => db.Countries.sync())
    .then(() => db.Labels.sync())
    .then(() => db.OrderDetails.sync())
    .then(() => db.Photos.sync())
    .then(() => db.Products.sync())
    .then(() => db.PurchaseOrders.sync())
    .then(() => db.Series.sync())
    .then(() => db.TagGroups.sync())
    .then(() => db.Tags.sync())
    .catch(error => {
      logging.error(error, 'Data table synchronization failure')
      return Promise.reject(error)
    })
}

function establishAssociations () {
  // contact information relationships\
  db.Countries.hasMany(db.Companies, injectOptions('countryId', 'id'))
  db.Companies.belongsTo(db.Countries, injectOptions('countryId', 'id'))
  db.Companies.hasMany(db.Contacts, injectOptions('companyId', 'id'))
  db.Contacts.belongsTo(db.Companies, injectOptions('companyId', 'id'))
  // contacts and product ordering relationships
  db.Contacts.hasMany(db.PurchaseOrders, injectOptions('contactId', 'id'))
  db.PurchaseOrders.belongsTo(db.Contacts, injectOptions('contactId', 'id'))
  db.PurchaseOrders.belongsToMany(db.Products, injectOptions('purchaseOrderId', 'id', db.OrderDetails))
  db.Products.belongsToMany(db.PurchaseOrders, injectOptions('productId', 'id', db.OrderDetails))
  db.OrderDetails.belongsTo(db.PurchaseOrders, injectOptions('purchaseOrderId', 'id'))
  db.PurchaseOrders.hasMany(db.OrderDetails, injectOptions('purchaseOrderId', 'id'))
  db.OrderDetails.belongsTo(db.Products, injectOptions('productId', 'id'))
  db.Products.hasMany(db.OrderDetails, injectOptions('productId', 'id'))
  // product information relationships
  db.Series.hasMany(db.Products, injectOptions('seriesId', 'id'))
  db.Products.belongsTo(db.Series, injectOptions('seriesId', 'id'))
  db.Products.belongsToMany(db.Tags, injectOptions('productId', 'id', db.Labels))
  db.TagGroups.hasMany(db.Tags, injectOptions('tagGroupId', 'id'))
  db.Tags.belongsTo(db.TagGroups, injectOptions('tagGroupId', 'id'))
  db.Tags.belongsToMany(db.Products, injectOptions('tagId', 'id', db.Labels))
  db.Series.hasMany(db.Series, Object.assign({ as: 'childSeries' }, injectOptions('parentSeriesId', 'id')))
  // photo data relationships
  db.Photos.belongsTo(db.Series, injectOptions('seriesId', 'id'))
  db.Series.hasOne(db.Photos, injectOptions('seriesId', 'id'))
  db.Products.hasMany(db.Photos, injectOptions('productId', 'id'))
  db.Photos.belongsTo(db.Products, injectOptions('productId', 'id'))
  return Promise.resolve('Table relationships established')
}

function injectOptions (foreignKey, targetKey, throughModel = null, otherKey = null, constraints = true) {
  return Object.assign({
    constraints: constraints,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  }, {
    foreignKey: foreignKey,
    targetKey: targetKey,
  },
  throughModel === null ? {} : { through: throughModel },
  otherKey === null ? {} : { otherKey: otherKey }
  )
}
