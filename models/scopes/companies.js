module.exports = db => {
  db.Companies.addScope('withContactDetails', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Contacts }],
      order: ['title'],
    }
  })

  db.Companies.addScope('withCountryDetails', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Countries }],
      order: [
        [db.Countries, 'region'],
        [db.Countries, 'name'],
        ['title'],
      ],
    }
  })

  db.Companies.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [{ model: db.Countries }, { model: db.Contacts }],
      order: [
        [db.Countries, 'region'],
        [db.Countries, 'name'],
        ['title'],
      ],
    }
  })
}
