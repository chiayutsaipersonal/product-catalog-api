/* eslint-env mocha */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-expressions */

global.Promise = require('bluebird')

const server = require('../server')
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('Status and content', () => {
  describe('Main page', () => {
    it('has 200 status', () => {
      chai.request(server).get('/')
        .then(response => expect(response).to.have.status(200))
    })
    it('has text as response', () => {
      chai.request(server).get('/')
        .then(response => expect(response).to.be.text)
    })
    it('text is \'Hello World\'', () => {
      chai.request(server).get('/')
        .then(response => {
          expect(response.text).to.equal('Hello World')
        })
    })
  })
})

// it('content', done => {
//   chai
//     .request(server)
//     .get('http://localhost:8080/')
//     .end((err, res) => {
//       expect(res).to.be.text
//       expect(res.body).to.equal('Hello World')
//       done()
//     })
// })

// describe('About page', () => {
//   it('status', done => {
//     chai
//       .request(server)
//       .get('http://localhost:8080/about')
//       .end((err, res) => {
//         expect(res).to.have.status(404)
//         done()
//       })
//   })
// })
