const convertExcel = require('convert-excel-to-json')
const path = require('path')

const encryption = require('../controllers/encryption')

module.exports = (() => {
  let staff = convertExcel({
    sourceFile: path.resolve('./data/seed.xlsx'),
    header: { rows: 1 },
    columnToKey: {
      A: 'name',
      B: 'email',
      C: 'mobile',
      D: 'password',
      E: 'admin',
      F: 'companyId',
    },
    sheets: ['staff'],
  }).staff
  return staff.map(staffPerson => {
    let encrypted = encryption.sha512(
      !staffPerson.password ? '0000' : staffPerson.password,
      encryption.saltGen(16)
    )
    return Object.assign(staffPerson, {
      hashedPassword: encrypted.hashedPassword,
      salt: encrypted.salt,
    })
  })
})()
