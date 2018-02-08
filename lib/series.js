const convertExcel = require('convert-excel-to-json')
const path = require('path')

module.exports = (() => {
  return convertExcel({
    sourceFile: path.resolve('./data/seed.xlsx'),
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
})()
