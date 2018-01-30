const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database').db
const logging = require('../../controllers/logging')

module.exports = {
  /* lookup queries */
  getBasicInfoById,
  getCredentialById,
  verifyAdminAccount,
  /* insert queries */
  insert,
}

/* get login information of a contact record only */
function getCredentialById (contactId) {
  return db.Contacts
    .findById(contactId, {
      attributes: ['id', 'email', 'hashedPassword', 'salt', 'admin'],
      include: [{
        model: db.Companies,
        attributes: ['id', 'host'],
      }],
    })
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getCredentialById() errored')
      return Promise.rejectu(error)
    })
}

/* get basic info of a contact record */
function getBasicInfoById (contactId) {
  return db.Contacts
    .findById(contactId)
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getBasicInfoById() errored')
      return Promise.reject(error)
    })
}

/* verify existence of administrator account in db */
function verifyAdminAccount () {
  return db.Contacts.unscoped()
    .findAll({
      where: {
        name: 'Administrator',
        admin: true,
        companyId: null,
      },
    })
    .then(queryResults => Promise.resolve(queryResults.length === 1))
    .catch(error => {
      logging.error(error, './models/queries/contacts.verifyAdminAccount() errored')
      return Promise.reject(error)
    })
}

/* insert contact record */
function insert (accountData, transaction = null) {
  let id = !accountData.id
    ? uuidV4().toUpperCase()
    : accountData.id
  let query = !transaction
    ? db.Contacts.create(accountData)
    : db.Contacts.create(accountData, { transaction })
  return query
    .then(() => Promise.resolve(id))
    .catch(error => {
      logging.error(error, './models/queries/contacts.insert() errored')
      return Promise.reject(error)
    })
}
