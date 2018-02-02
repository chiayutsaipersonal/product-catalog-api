module.exports = {
  parseOrderDetailData,
}

// parsing order details data from request body
// stores temp information in req.orderDetailsData
function parseOrderDetailData (req, res, next) {
  // skipped if no product inquiry is found in the request
  if (!req.body.productIdList) return next()
  // get a copy of the inquired products
  let productIdList = JSON.parse(JSON.stringify(req.body.productIdList))
  // check if there are actual items in the inquiry
  if (productIdList.length > 0) {
    // prep order details data
    req.orderDetailData = []
    productIdList.forEach((productId, index) => {
      req.orderDetailData.push({
        productId,
        quantity: !req.is('application/json')
          ? parseInt(req.body.quantities[index]) || null
          : req.body.quantities[index] || null,
      })
    })
    return next()
  } else {
    return next()
  }
}
