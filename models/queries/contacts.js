const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database').db
const logging = require('../../controllers/logging')

module.exports = {
  // lookup queries
  getBasicInfoById,
  getDetailedInfoById,
  getCredentialById,
  getCredentialByEmail,
  verifyMasterAdminAccount,
  // insert queries
  insert,
}

// get login information of a contact record only
function getCredentialByEmail (email) {
  return db.Contacts
    .scope('credentialsOnly')
    .findOne({ where: { email } })
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getCredentialByEmail() errored')
      return Promise.rejectu(error)
    })
}

// get login information of a contact record only
function getCredentialById (contactId) {
  return db.Contacts
    .scope('credentialsOnly')
    .findById(contactId)
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getCredentialById() errored')
      return Promise.rejectu(error)
    })
}

// get basic info of a contact record
function getBasicInfoById (contactId) {
  return db.Contacts
    .findById(contactId)
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getBasicInfoById() errored')
      return Promise.reject(error)
    })
}

// get detailed info of a contact record
function getDetailedInfoById (contactId) {
  return db.Contacts
    .scope('detailed')
    .findById(contactId)
    .then(queryResults => Promise.resolve(queryResults))
    .catch(error => {
      logging.error(error, './models/queries/contacts.getBasicInfoById() errored')
      return Promise.reject(error)
    })
}

// verify existence of the master admin account in db
function verifyMasterAdminAccount () {
  return db.Contacts
    .findAll({
      where: {
        name: 'Administrator',
        admin: true,
        companyId: null,
      },
    })
    .then(queryResults => Promise.resolve(queryResults.length === 1))
    .catch(error => {
      logging.error(error, './models/queries/contacts.verifyMasterAdminAccount() errored')
      return Promise.reject(error)
    })
}

// insert contact record
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
