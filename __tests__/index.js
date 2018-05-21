const request = require('supertest')
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const path = require('path')
const fs = require('fs')
let server

async function del(f) {
  fs.unlink(f, () => { })
}

beforeEach(() => {
  server = require('../')
})

afterEach(() => {
  require('../').stop()
})

describe('api', () => {
  it('should failfor unknown handler', async (done) => {
    const body = {
      action: 'ZAZZZZ'
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(500)
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should generate key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0x6f41fffc0338e715e8aac4851afc4079b712af70'
      }
    }
    await del(path.join(process.cwd(), '__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))
    await del(path.join(process.cwd(), '__mocks__', 'mem', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))
    await del(path.join(process.cwd(), '__mocks__', 'pub', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      done()
    }).catch((e) => {
      console.log(e)
    })
  })
})
