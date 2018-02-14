module.exports = db => {
  db.PurchaseOrders.addScope('pending', () => {
    return {
      attributes: { exclude: ['deletedAt'] },
      where: {
        [db.Sequelize.Op.or]: [
          { contacted: false },
          { notified: false },
        ],
      },
      include: [
        {
          model: db.Contacts,
          include: [{
            model: db.Companies,
            include: [{ model: db.Countries }],
          }],
        },
        { model: db.Products, through: { attributes: ['quantity'] } },
      ],
      order: [
        ['updatedAt', 'desc'],
        [db.Products, 'code'],
      ],
    }
  })

  db.PurchaseOrders.addScope('detailed', () => {
    return {
      attributes: { exclude: ['deletedAt'] },
      include: [
        {
          model: db.Contacts,
          include: [{
            model: db.Companies,
            include: [{ model: db.Countries }],
          }],
        },
        { model: db.Products, through: { attributes: ['quantity'] } },
      ],
      order: [
        'updatedAt',
        [db.Products, 'code'],
      ],
    }
  })
}
