module.exports = db => {
  db.Photos.addScope('imageOnly', () => {
    return {
      attributes: ['id', 'data', 'mimeType'],
      order: [['isPrimary', 'desc']],
    }
  })
}
