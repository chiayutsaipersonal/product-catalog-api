const assert = require('chai').assert

const max = require('../lib/max')

describe('#max', () => {
  it('should return the maximum in array', done => {
    let maximum = max([1, 10, 100, 1000])
    assert.strictEqual(maximum, 1000)
    done()
  })
  it('should return undefined when array is empty', done => {
    const maximum = max([])
    assert.isUndefined(maximum)
    done()
  })
})
