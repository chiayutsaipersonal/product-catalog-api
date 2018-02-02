
const multer = require('multer')

module.exports = {
  createByVisitor: [
    multer().none(),
  ],
  parsePurchaseOrderData,
}

// parsing purchase order data from request body
// stores temp information in req.purchaseOrderData
function parsePurchaseOrderData (req, res, next) {
  req.purchaseOrderData = {
    contactId: req.contactData.id,
    comments: req.body.comments || null,
    contacted: false,
    notified: false,
  }
}
