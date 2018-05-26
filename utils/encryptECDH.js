const CTX = require('milagro-crypto-js')
const hexToBytes = require('./hexToBytes')
const stringToBytes = require('./stringToBytes')
const genRng = require('./genRng')

const encryptECDH = async (pub, message) => {
  const ctx = new CTX('NIST256')
  const sha = ctx.ECDH.HASH_TYPE

  const P1 = []
  const P2 = []
  const V = []
  const T = new Array(12)

  P1[0] = 0x0
  P1[1] = 0x1
  P1[2] = 0x2
  P2[0] = 0x0
  P2[1] = 0x1
  P2[2] = 0x2
  P2[3] = 0x3

  const rng = await genRng(ctx)
  const pubKey = await hexToBytes(pub)
  const res = ctx.ECDH.PUBLIC_KEY_VALIDATE(pubKey)
  if (res !== 0) {
    console.error('ECP Public Key is invalid!')
  } else {
    let M
    if (typeof message === 'object') {
      M = JSON.stringify(message)
    } else {
      M = message
    }

    const based = Buffer.from(M).toString('base64')
    const msg = await stringToBytes(based)
    const C = ctx.ECDH.ECIES_ENCRYPT(sha, P1, P2, rng, pubKey, msg, V, T)

    const out = {
      v: V,
      c: C,
      t: T
    }

    return out
  }
  return null
}

module.exports = encryptECDH
