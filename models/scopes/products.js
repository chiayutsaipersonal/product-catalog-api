module.exports = db => {
  db.Products.addScope('detailed', () => {
    return {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        { model: db.Series },
        { model: db.Tags },
        { model: db.Photos, attributes: { exclude: ['data'] } },
      ],
      order: [
        'code',
        [db.Tags, 'name'],
        [db.Photos, 'primary', 'desc'],
      ],
    }
  })
}
