const convertExcel = require('convert-excel-to-json')
const path = require('path')

module.exports = (() => {
  return convertExcel({
    sourceFile: path.resolve('./data/seed.xlsx'),
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
})()
