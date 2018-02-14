module.exports = db => {
  db.Series.addScope('siblings', (parentSeriesId = null) => {
    return {
      where: { parentSeriesId },
      order: ['displaySequence'],
    }
  })

  db.Series.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        { model: db.Products },
        { model: db.Photos },
        { model: db.Series, as: 'childSeries' },
      ],
      order: [
        'menuLevel',
        'displaySequence',
        [db.Products, 'code'],
      ],
    }
  })
}
