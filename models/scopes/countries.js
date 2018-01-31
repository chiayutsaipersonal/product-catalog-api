module.exports = db => {
  db.Countries.addScope('flagOnly', () => {
    return {
      attributes: ['id', 'flagSvg'],
      order: ['id'],
    }
  })

  db.Countries.addScope('detailed', () => {
    return {
      attributes: { exclude: [] },
      order: ['region', 'name'],
    }
  })
}
