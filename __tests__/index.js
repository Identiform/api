const Promise = require('bluebird')
const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const path = require('path')
const fs = Promise.promisifyAll(require('fs'))
let server
const decrypt = require('../utils/decrypt')

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
  it('should fail for unknown handler', async (done) => {
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

  it('should generate #2 key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'
      }
    }
    await del(path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))
    await del(path.join(process.cwd(), '__mocks__', 'mem', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))
    await del(path.join(process.cwd(), '__mocks__', 'pub', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('private keys should not be empty', async (done) => {
    const privkeyLoc1 = path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
    const privkeyLoc2 = path.join(process.cwd(), '__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
    const pk1 = await fs.readFileSync(privkeyLoc1)
    const pk2 = await fs.readFileSync(privkeyLoc2)
    assert.deepEqual(pk1.length > 30, true)
    assert.deepEqual(pk2.length > 30, true)
    done()
  })

  it('private keys should differ', async (done) => {
    const privkeyLoc1 = path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
    const privkeyLoc2 = path.join(process.cwd(), '__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
    const pk1 = await fs.readFileSync(privkeyLoc1)
    const pk2 = await fs.readFileSync(privkeyLoc2)
    assert.notEqual(pk1, pk2)
    done()
  })

  it('should encrypt text', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        secretOwner: '0x6f41fffc0338e715e8aac4851afc4079b712af70',
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: 'this is secret to everyone'
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join(process.cwd(), '__mocks__', 'pub', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decrypt(privKey, res.body.data)
          decoded.should.eql('this is secret to everyone')
        }
      })
      done()
    })
  })
})
