const assert = require('chai').assert

const min = require('lib/min')

describe('#min', () => {
  it('should return the minimum in array', done => {
    let minimum = min([1, 10, 100, 1000])
    assert.strictEqual(minimum, 1)
    done()
  })
  it('should return undefined when array is empty', done => {
    // test
    const minimum = min([])
    assert.isUndefined(minimum)
    done()
  })
})
