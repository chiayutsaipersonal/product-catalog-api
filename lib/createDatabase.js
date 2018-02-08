const fs = require('fs-extra')
const path = require('path')
const Promise = require('bluebird')

// const appConfig = require('../config/app')
// const dbConfig = require('../../config/database')[appConfig.nodeEnv]
const adminPassword = require('../config/sensitiveInfo').ADMIN_APP_PASSWORD
const adminEmail = require('../config/sensitiveInfo').ADMIN_EMAIL

const encryption = require('../controllers/encryption')
const logging = require('../controllers/logging')

const authenticate = require('../controllers/database/authenticate')
const register = require('../controllers/database/register')
const scopes = require('../controllers/database/scopes')
const sync = require('../controllers/database/sync')
const associate = require('../controllers/database/associate')

const contactQueries = require('../models/queries/contacts')
const countryQueries = require('../models/queries/countries')
const companyQueries = require('../models/queries/companies')
const seriesQueries = require('../models/queries/series')
const productQueries = require('../models/queries/products')
const tagQueries = require('../models/queries/tags')

return authenticate()
  .then(db => register(db))
  .then(db => sync(db))
  .then(db => associate(db))
  .then(db => sync(db))
  .then(db => scopes(db))
  .then(db => {
    let encrypted = encryption.sha512(adminPassword, encryption.saltGen(16))
    return contactQueries.insert(db, {
      name: 'Administrator',
      email: adminEmail,
      hashedPassword: encrypted.hashedPassword,
      salt: encrypted.salt,
      admin: true,
    }).then(() => {
      logging.console('Established admin account')
      return Promise.resolve(db)
    })
  })
  .then(db => {
    let basePath = path.resolve('./node_modules/world-countries')
    let dataPath = path.join(basePath, 'dist/countries.json')
    let flagPath = path.join(basePath, 'data')
    return fs.readJson(dataPath)
      .then(data => {
        let countries = data.map(country => {
          let id = country.cca3.toLowerCase()
          return {
            id,
            name: country.name.common,
            region: country.region === '' ? 'Other' : country.region,
            flagSvg: fs.readFileSync(path.join(flagPath, `${id}.svg`), 'utf8'),
          }
        })
        return Promise.resolve(countries)
      })
      .then(countries => countryQueries.bulkCreate(db, countries))
      .then(() => {
        logging.console('Countries table data seeded')
        return Promise.resolve(db)
      })
  })
  .then(db => {
    return companyQueries
      .bulkCreate(db, require('./hostCompanies'))
      .then(() => {
        logging.console('Hosting company data seeded')
        return Promise.resolve(db)
      })
  })
  .then(db => {
    return contactQueries
      .bulkCreate(db, require('./staff'))
      .then(() => {
        logging.console('Staff data seeded')
        return Promise.resolve(db)
      })
  })
  .then(db => {
    let series = require('./series')
    // series are broken down by levels and placed in an array
    // so they can be written into the db sequentially, to avoid
    // child series being create before its parent series

    // find the max level count
    let levelCount = series.reduce((maxValue, seriesItem) => {
      return seriesItem.menuLevel > maxValue ? seriesItem.menuLevel : maxValue
    }, 0)
    // break each level down by filtering and pushed into an array
    let seriesByLevel = []
    for (let x = 0; x <= levelCount; x++) {
      seriesByLevel.push(series.filter(seriesItem => seriesItem.menuLevel === x))
    }
    // sequentially creating series by menuLevel value (level 0, level 1, etc...)
    return Promise.each(seriesByLevel, seriesInLevel => {
      return seriesQueries.bulkCreate(db, seriesInLevel)
    }).then(() => {
      logging.console('Series data seeded')
      return Promise.resolve(db)
    })
  })
  .then(db => {
    return productQueries
      .bulkCreate(db, require('./products'))
      .then(() => {
        logging.console('Product data seeded')
        return Promise.resolve(db)
      })
  })
  .then(db => {
    return tagQueries
      .bulkCreate(db, require('./tags'))
      .then(() => {
        logging.console('Tag data seeded')
        return Promise.resolve(db)
      })
  })
  .then(db => {
    return Promise.resolve()
  })
  .then(() => {
    return Promise.resolve()
  })
  .then(() => {
    logging.console('Create database script completed')
    return process.exit()
  })
  .catch(error => {
    logging.error(error, 'Create database script failure')
    return process.exit(1)
  })
