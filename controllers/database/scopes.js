const logging = require('../../controllers/logging')

module.exports = db => {
  require('../../models/scopes/companies')(db)
  require('../../models/scopes/contacts')(db)
  require('../../models/scopes/countries')(db)
  require('../../models/scopes/photos')(db)
  require('../../models/scopes/products')(db)
  require('../../models/scopes/purchaseOrders')(db)
  require('../../models/scopes/series')(db)
  logging.console('Models scopes registered')
  return Promise.resolve(db)
}
