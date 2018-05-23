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
const decryptECDH = require('../utils/decryptECDH')

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

  it('should generate #3 key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0x1cb0ff92ec067169fd6b1b12c6d39a4f6c2cf6f9'
      }
    }
    await del(path.join(process.cwd(), '__mocks__', 'pk', '0x1cb0ff92ec067169fd6b1b12c6d39a4f6c2cf6f9'))
    await del(path.join(process.cwd(), '__mocks__', 'mem', '0x1cb0ff92ec067169fd6b1b12c6d39a4f6c2cf6f9'))
    await del(path.join(process.cwd(), '__mocks__', 'pub', '0x1cb0ff92ec067169fd6b1b12c6d39a4f6c2cf6f9'))

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
      action: 'KEYS_ENCRYPT_ECDH',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: 'this is secret to everyone'
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data.v, res.body.data.c, res.body.data.t)
          decoded.should.eql('this is secret to everyone')
          done()
        }
      })
    })
  })

  it('should encrypt unicode text correctly', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: escape('✔test')
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data.v, res.body.data.c, res.body.data.t)
          decoded.should.eql(escape('✔test'))
          done()
        }
      })
    })
  })

  it('should encrypt HTML correctly', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      data: {
        pathname: path.join(process.cwd(), '__mocks__'),
        user: '0x6f41fffc0338e715e8aac4851afc4079b712af70',
        text: '<p>secret text</p>'
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join(process.cwd(), '__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data.v, res.body.data.c, res.body.data.t)
          decoded.should.eql('<p>secret text</p>')
          done()
        }
      })
    })
  })

  it('should encrypt large data objects correctly', async (done) => {
    const blobLoc = path.join(process.cwd(), '__mocks__', 'blob.txt')
    fs.readFile(blobLoc, 'ascii', async (er, blob) => {
      if (!er) {
        const body = {
          action: 'KEYS_ENCRYPT_ECDH',
          data: {
            pathname: path.join(process.cwd(), '__mocks__'),
            user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
            text: blob
          }
        }

        chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          const privkeyLoc = path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
          fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
            if (!er) {
              const decoded = await decryptECDH(privKey, res.body.data.v, res.body.data.c, res.body.data.t)
              decoded.should.eql(blob)
              done()
            }
          })
        })
      }
    })
  })

  it('should send emails', async (done) => {
    const body = {
      action: 'EMAIL_SEND',
      data: {
        apiKey: 'test',
        email: {
          to: 'Me <wqzx2dsvn37jra3t@ethereal.email>',
          subject: '✔',
          text: 'Hello to myself!',
          html: '<p><b>Hello</b> to myself!</p>'
        }
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      res.body.messageSize.should.eql(557)
      done()
    })
  })
})
