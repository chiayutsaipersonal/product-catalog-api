module.exports = parseContactIdFromRequest

/**
 * parse contactId from either req.params.contactId or req.body.contactId
 * @param {*} req
 */
function parseContactIdFromRequest (req) {
  return 'contactId' in req.params
    ? req.params.contactId.toUpperCase()
    : 'contactId' in req.body ? req.body.contactId.toUpperCase() : null
}
