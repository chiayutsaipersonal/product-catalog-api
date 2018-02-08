const convertExcel = require('convert-excel-to-json')
const path = require('path')

module.exports = (() => {
  return convertExcel({
    sourceFile: path.resolve('./data/seed.xlsx'),
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
})()
