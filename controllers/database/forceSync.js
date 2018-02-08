const logging = require('../logging')

module.exports = db => {
  return db.Companies.sync({ force: true })
    .catch(error => {
      logging.warning('Model \'Companies\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Contacts.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Contacts\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Countries.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Countries\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Labels.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Labels\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.OrderDetails.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'OrderDetails\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Photos.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Photos\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Products.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Products\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.PurchaseOrders.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'PurchaseOrders\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Series.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Series\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.TagGroups.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'TagGroups\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => db.Tags.sync({ force: true }))
    .catch(error => {
      logging.warning('Model \'Tags\' resynchronization failure')
      return Promise.reject(error)
    })
    .then(() => {
      logging.console('Model resyc\'ed')
      return Promise.resolve(db)
    })
    .catch(error => {
      logging.warning('Model resync failure')
      return Promise.reject(error)
    })
}
