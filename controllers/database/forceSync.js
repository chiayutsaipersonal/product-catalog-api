const logging = require('../logging')

module.exports = db => {
  return db.Companies.sync({ force: true })
    .catch(error => {
      logging.warning('\'Companies\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Contacts.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Contacts\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Countries.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Countries\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Labels.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Labels\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.OrderDetails.sync({ force: true }))
    .catch(error => {
      logging.warning('\'OrderDetails\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Photos.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Photos\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Products.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Products\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.PurchaseOrders.sync({ force: true }))
    .catch(error => {
      logging.warning('\'PurchaseOrders\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Series.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Series\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.TagGroups.sync({ force: true }))
    .catch(error => {
      logging.warning('\'TagGroups\' model resync failure')
      return Promise.reject(error)
    })
    .then(() => db.Tags.sync({ force: true }))
    .catch(error => {
      logging.warning('\'Tags\' model resync failure')
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
