module.exports = db => {
  db.Contacts.addScope('credentialsOnly', () => {
    return {
      attributes: ['id', 'email', 'hashedPassword', 'salt', 'admin'],
      include: [{
        model: db.Companies,
        attributes: ['id', 'host'],
      }],
    }
  })

  db.Contacts.addScope('detailed', () => {
    return {
      attributes: ['id', 'email', 'name', 'mobile', 'companyId', 'admin'],
      include: [{ model: db.Companies }],
      order: [
        [db.Companies, 'title'],
        ['name'],
      ],
    }
  })
}
