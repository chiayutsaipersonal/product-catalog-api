const convertExcel = require('convert-excel-to-json')
const path = require('path')

const encryption = require('controllers/encryption')

module.exports = {
  hostCompanies: () => {
    return convertExcel({
      sourceFile: path.resolve('./data/seedFile.xlsx'),
      header: { rows: 1 },
      columnToKey: {
        A: 'id',
        B: 'title',
        C: 'address',
        D: 'telephone',
        E: 'fax',
        F: 'website',
        G: 'host',
        H: 'countryId',
      },
      sheets: ['hostCompanies'],
    }).hostCompanies
  },
  products: () => {
    return convertExcel({
      sourceFile: path.resolve('./data/seedFile.xlsx'),
      header: { rows: 1 },
      columnToKey: {
        A: 'id',
        B: 'code',
        C: 'name',
        D: 'specification',
        E: 'description',
        F: 'seriesId',
      },
      sheets: ['products'],
    }).products
  },
  series: () => {
    return convertExcel({
      sourceFile: path.resolve('./data/seedFile.xlsx'),
      header: { rows: 1 },
      columnToKey: {
        A: 'id',
        B: 'name',
        C: 'displaySequence',
        D: 'menuLevel',
        E: 'parentSeriesId',
      },
      sheets: ['series'],
    }).series
  },
  staff: () => {
    let staff = convertExcel({
      sourceFile: path.resolve('./data/seedFile.xlsx'),
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
  },
  tags: () => {
    return convertExcel({
      sourceFile: path.resolve('./data/seedFile.xlsx'),
      header: { rows: 1 },
      columnToKey: {
        A: 'id',
        B: 'tagGroupId',
        C: 'name',
        D: 'color',
      },
      sheets: ['tags'],
    }).tags
  },
}
