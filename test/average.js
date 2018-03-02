const assert = require('chai').assert

const average = require('lib/average')

describe('#average', () => {
  it('should return the average of array', done => {
    let avg = average([1, 2, 3, 4])
    assert.strictEqual(avg, 2.5)
    done()
  })
  it('should return NaN when array is empty', done => {
    const avg = average([])
    assert.isNaN(avg)
    done()
  })
})
