const logging = require('../logging')

module.exports = db => {
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
    .then(() => {
      logging.console('Model synchronized')
      return Promise.resolve(db)
    })
    .catch(error => {
      logging.warning('Model synchronization failure')
      return Promise.reject(error)
    })
}
