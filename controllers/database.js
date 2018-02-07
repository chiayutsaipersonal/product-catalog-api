const fileExists = require('file-exists')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const isemail = require('isemail')
const path = require('path')
const Promise = require('bluebird')
const Sequelize = require('sequelize')

const appConfig = require('../config/app')
const dbConfig = require('../config/database')

const encryption = require('./encryption')
const logging = require('./logging')

const sequelize = new Sequelize(dbConfig)

const db = {
  sequelize,
  Sequelize,
  Companies: require('../models/definitions/companies.js')(sequelize, Sequelize),
  Contacts: require('../models/definitions/contacts.js')(sequelize, Sequelize),
  Countries: require('../models/definitions/countries.js')(sequelize, Sequelize),
  Labels: require('../models/definitions/labels.js')(sequelize, Sequelize),
  OrderDetails: require('../models/definitions/orderDetails.js')(sequelize, Sequelize),
  Photos: require('../models/definitions/photos.js')(sequelize, Sequelize),
  Products: require('../models/definitions/products.js')(sequelize, Sequelize),
  PurchaseOrders: require('../models/definitions/purchaseOrders.js')(sequelize, Sequelize),
  Series: require('../models/definitions/series.js')(sequelize, Sequelize),
  TagGroups: require('../models/definitions/tagGroups.js')(sequelize, Sequelize),
  Tags: require('../models/definitions/tags.js')(sequelize, Sequelize),
}

module.exports = {
  db,
  create,
  close,
  init, // create or sync depending on the existence of the db file
  sync,
}

const contactQueries = require('../models/queries/contacts')

function create () {
  return close()
    .then(() => remove())
    .then(() => verify())
    .then(() => forcedSyncModels())
    .then(() => establishAssociations())
    .then(() => forcedSyncModels())
    .then(() => addScopes())
    .then(() => ensureAdmin())
    .catch(error => {
      logging.warning('Database creation failure')
      return Promise.reject(error)
    })
}

// remove database or file depending on which type of database is being used
function remove (db) {
  let query = dbConfig.dialect !== 'sqlite'
    ? db.Sequelize.query(`DROP DATABASE ${appConfig.reference}`)
    : fs.remove(dbConfig.storage).then(() => fs.ensureDir(dbConfig.location))
  return query()
    .then(() => {
      logging.console(`Database '${appConfig.reference}' removed`)
      return Promise.resolve()
    })
    .catch(error => {
      logging.warning(`Database '${appConfig.reference}' removal failure`)
      return Promise.reject(error)
    })
}

// close database connection
function close (db) {
  return db.sequelize
    ? db.sequelize.close()
    : Promise.resolve()
}

// verify connection
function verify () {
  return sequelize
    .authenticate()
    .then(() => {
      logging.console('Database verified')
      return Promise.resolve()
    })
    .catch(error => {
      logging.warning('Database verification failure')
      return Promise.reject(error)
    })
}

// ///////////////////////////////////////////////////

function addScopes () {
  require('../models/scopes/companies')(db)
  require('../models/scopes/contacts')(db)
  require('../models/scopes/countries')(db)
  require('../models/scopes/photos')(db)
  require('../models/scopes/products')(db)
  require('../models/scopes/purchaseOrders')(db)
  require('../models/scopes/series')(db)
  return Promise.resolve()
}

function consentToCreate () {
  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'consent',
      message: 'Required admin account is missing, create it?',
      default: true,
    }, {
      type: 'input',
      name: 'email',
      message: 'Enter email of admin account: ',
      default: appConfig.default.adminEmail,
      filter: input => input.toLowerCase(),
      validate: input => isemail.validate(input) ? true : 'invalid email format',
      when: response => response.consent,
    }])
    .then(response => Promise.resolve(response))
}

function createAdminAccountFromConsole () {
  let email = null
  let encrypted = null
  return consentToCreate()
    .then(response => {
      if (!response.consent) {
        logging.warning('Declined to create Admin account')
        return process.exit(0)
      }
      email = response.email
      return getPassword()
    })
    .then(response => {
      encrypted = encryption.sha512(response, encryption.saltGen(16))
      return finalConfirmation()
    })
    .then(response => {
      if (!response) {
        logging.warning('Declined to create Admin account')
        return process.exit(0)
      }
      return contactQueries.insert({
        email,
        name: 'Administrator',
        hashedPassword: encrypted.hashedPassword,
        salt: encrypted.salt,
        admin: true,
      })
    })
    .then(() => Promise.resolve('Admin account created'))
    .catch(error => {
      console.warning('Admin account creation failure')
      return Promise.reject(error)
    })
}

function ensureAdmin () {
  return contactQueries
    .verifyMasterAdminAccount()
    .then(queryResults => queryResults
      ? Promise.resolve('Admin account validated')
      : createAdminAccountFromConsole())
    .then(resultMessage => Promise.resolve(resultMessage))
    .catch(error => {
      logging.error(error, 'Mandatory administrator account missing')
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

function finalConfirmation () {
  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'finalConfirmation',
      message: 'Please confirm to create the administration account?',
      default: false,
    }])
    .then(response => Promise.resolve(response.finalConfirmation))
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
      logging.warning('Data table synchronization failure')
      return Promise.reject(error)
    })
}

function getPassword () {
  return inquirer
    .prompt([{
      type: 'password',
      name: 'password',
      message: 'Enter admin password: ',
      default: appConfig.default.adminPassword,
      validate: input => validateLength(input) ? true : 'password length must be 8~20 characters',
    }, {
      type: 'password',
      name: 'confirmedPassword',
      message: 'Confirm and enter admin password again: ',
      default: appConfig.default.adminPassword,
      validate: input => validateLength(input) ? true : 'password length must be 8~20 characters',
    }])
    .then(response => {
      if (response.password === response.confirmedPassword) {
        return Promise.resolve(response.password)
      } else {
        logging.warning('Passwords did not match...')
        return getPassword()
      }
    })
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

function init () {
  return fileExists(path.resolve(dbConfig.storage))
    .then(existence => {
      if (existence) {
        logging.console('Existing database detected')
        return sync()
      } else {
        logging.console('Database missing')
        return create()
      }
    })
    .then(() => Promise.resolve('Database initialization completed'))
    .catch(error => {
      logging.error(error, 'Database initialization failure')
      return Promise.reject(error)
    })
}

function sync () {
  return verify()
    .then(() => syncModels())
    .then(() => establishAssociations())
    .then(() => syncModels())
    .then(() => addScopes())
    .then(() => ensureAdmin())
    .catch(error => {
      logging.warning('Database synchronization failure')
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
      logging.warning('Data table synchronization failure')
      return Promise.reject(error)
    })
}

function validateLength (stringValue) {
  return (stringValue.length >= 8) && (stringValue.length <= 20)
}
