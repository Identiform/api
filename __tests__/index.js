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

function del(f) {
  fs.unlink(f, () => { })
}

beforeEach(() => {
  server = require('../')
});

afterEach(() => {
  require('../').stop()
});

describe('api', () => {
  it('should fail for unknown handler', async (done) => {
    const body = {
      action: 'ZAZZZZ',
      apiKey: 'test'
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(500)
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should fail without api key', async (done) => {
    const body = {
      action: 'ZAZZZZ'
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(401)
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should fail with wrong api key', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'zz'
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(401)
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should generate key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0x6f41fffc0338e715e8aac4851afc4079b712af70'
      }
    }

    del(path.join(process.cwd(), '__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))
    del(path.join(process.cwd(), '__mocks__', 'mem', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))
    del(path.join(process.cwd(), '__mocks__', 'pub', '0x6f41fffc0338e715e8aac4851afc4079b712af70'))

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should not overwrite existing keys', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0x6f41fffc0338e715e8aac4851afc4079b712af70'
      }
    }

    const privkeyLoc = path.join('__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
    const pk = await fs.readFileSync(privkeyLoc)

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      fs.readFile(privkeyLoc, (e, pk1) => {
        res.type.should.eql('application/json')
        assert.deepEqual(pk, pk1)
        done()
      })
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should generate #2 key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'
      }
    }

    del(path.join(process.cwd(), '__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))
    del(path.join(process.cwd(), '__mocks__', 'mem', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))
    del(path.join(process.cwd(), '__mocks__', 'pub', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97'))

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('cannot generate not eth address keys', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xad8926fd14c2ca283ab1e8a05c0b6707bc03f97'
      }
    }

    const privkeyLoc = path.join('__mocks__', 'pk', '0xad8926fd14c2ca283ab1e8a05c0b6707bc03f97')

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.type.should.eql('application/json')
      expect(privkeyLoc).to.not.be.a.path()
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should generate #3 key pair', async (done) => {
    const body = {
      action: 'KEYS_GENERATE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xa1bf121993c23cc467eec8b7e453011dae250404'
      }
    }

    del(path.join('__mocks__', 'pk', '0xa1bf121993c23cc467eec8b7e453011dae250404'))
    del(path.join('__mocks__', 'mem', '0xa1bf121993c23cc467eec8b7e453011dae250404'))
    del(path.join('__mocks__', 'pub', '0xa1bf121993c23cc467eec8b7e453011dae250404'))

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('should delete key upon request', async (done) => {
    const body = {
      action: 'KEYS_DELETE',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xa1bf121993c23cc467eec8b7e453011dae250404'
      }
    }

    const privkeyLoc = path.join('__mocks__', 'pk', '0xa1bf121993c23cc467eec8b7e453011dae250404')
    const pubkeyLoc = path.join('__mocks__', 'pub', '0xa1bf121993c23cc467eec8b7e453011dae250404')
    const mLoc = path.join('__mocks__', 'mem', '0xa1bf121993c23cc467eec8b7e453011dae250404')

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then((res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      res.body.result.should.eql('done')
      assert.deepEqual(fs.existsSync(privkeyLoc), false)
      assert.deepEqual(fs.existsSync(pubkeyLoc), false)
      assert.deepEqual(fs.existsSync(mLoc), false)
      done()
    }).catch((e) => {
      console.log(e)
    })
  })

  it('private keys should not be empty', async (done) => {
    const privkeyLoc1 = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
    const privkeyLoc2 = path.join('__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
    const pk1 = await fs.readFileSync(privkeyLoc1)
    const pk2 = await fs.readFileSync(privkeyLoc2)
    assert.deepEqual(pk1.length > 30, true)
    assert.deepEqual(pk2.length > 30, true)
    done()
  })

  it('private keys should differ', async (done) => {
    const privkeyLoc1 = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
    const privkeyLoc2 = path.join('__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
    const pk1 = await fs.readFileSync(privkeyLoc1)
    const pk2 = await fs.readFileSync(privkeyLoc2)
    assert.notEqual(pk1, pk2)
    done()
  })

  it('should encrypt text', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: 'this is secret to everyone'
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data)
          decoded.should.eql('this is secret to everyone')
          done()
        } else {
          console.log(er)
        }
      })
    })
  })

  it('should encrypt objects correctly', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: JSON.stringify({ a: 'aaa', b: [0, 1], c: { k: 'a' }, d: 101 })
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      const blobLoc = path.join('__mocks__', 'blob2.txt')
      await fs.writeFileAsync(blobLoc, JSON.stringify(res.body.data), 'ascii').then(() => {
        res.status.should.eql(200)
        res.type.should.eql('application/json')
        const privkeyLoc = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
        fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
          if (!er) {
            const decoded = JSON.parse(await decryptECDH(privKey, res.body.data))
            decoded.a.should.eql('aaa')
            decoded.d.should.eql(101)
            done()
          } else {
            console.log(er)
          }
        })
      })
    })
  })

  it('should decrypt text', async (done) => {
    const blobLoc = path.join('__mocks__', 'blob2.txt')
    fs.readFile(blobLoc, 'ascii', async (er, blob) => {
      if (er) {
        console.log(er)
      }
      const body = {
        action: 'KEYS_DECRYPT_ECDH',
        apiKey: 'test',
        data: {
          pathname: path.join('__mocks__'),
          user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
          text: blob
        }
      }

      chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
        res.status.should.eql(200)
        const d = JSON.parse(res.body.data)
        res.type.should.eql('application/json')
        d.a.should.eql('aaa')
        d.d.should.eql(101)
        done()
      }).catch((e) => {
        console.log(e)
      })
    })
  })

  it('should encrypt unicode text correctly', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
        text: escape('✔test')
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data)
          decoded.should.eql(escape('✔test'))
          done()
        }
      })
    })
  })

  it('should encrypt HTML correctly', async (done) => {
    const body = {
      action: 'KEYS_ENCRYPT_ECDH',
      apiKey: 'test',
      data: {
        pathname: path.join('__mocks__'),
        user: '0x6f41fffc0338e715e8aac4851afc4079b712af70',
        text: '<p>secret text</p>'
      }
    }

    chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
      res.status.should.eql(200)
      res.type.should.eql('application/json')
      const privkeyLoc = path.join('__mocks__', 'pk', '0x6f41fffc0338e715e8aac4851afc4079b712af70')
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, res.body.data)
          decoded.should.eql('<p>secret text</p>')
          done()
        }
      })
    })
  })

  it('should encrypt large data objects correctly', async (done) => {
    const blobLoc = path.join('__mocks__', 'blob.txt')
    fs.readFile(blobLoc, 'ascii', async (er, blob) => {
      if (!er) {
        const body = {
          action: 'KEYS_ENCRYPT_ECDH',
          apiKey: 'test',
          data: {
            pathname: path.join('__mocks__'),
            user: '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97',
            text: blob
          }
        }

        chai.request(server).post('/').set('Content-Type', 'application/json').send(body).then(async (res) => {
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          const privkeyLoc = path.join('__mocks__', 'pk', '0xad8926fdb14c2ca283ab1e8a05c0b6707bc03f97')
          fs.readFile(privkeyLoc, 'ascii', async (e, privKey) => {
            if (!e) {
              const decoded = await decryptECDH(privKey, res.body.data)
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
      apiKey: 'test',
      data: {
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
