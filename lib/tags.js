const convertExcel = require('convert-excel-to-json')
const path = require('path')

module.exports = (() => {
  return convertExcel({
    sourceFile: path.resolve('./data/seed.xlsx'),
    header: { rows: 1 },
    columnToKey: {
      A: 'id',
      B: 'tagGroupId',
      C: 'name',
      D: 'color',
    },
    sheets: ['tags'],
  }).tags
})()
