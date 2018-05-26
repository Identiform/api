const CTX = require('milagro-crypto-js')
const bytesToString = require('./bytesToString')
const hexToBytes = require('./hexToBytes')

const decryptECDH = async (priv, blob) => {
  const ctx = new CTX('NIST256')
  const sha = ctx.ECDH.HASH_TYPE

  const P1 = []
  const P2 = []
  let M = []

  P1[0] = 0x0
  P1[1] = 0x1
  P1[2] = 0x2
  P2[0] = 0x0
  P2[1] = 0x1
  P2[2] = 0x2
  P2[3] = 0x3

  let D
  try {
    D = JSON.parse(blob)
  } catch (e) {
    D = blob
  }

  if (D) {
    const T = D.t
    const C = D.c
    const V = D.v
    const privKey = await hexToBytes(priv)
    for (let i = 0; i <= 16; i++) {
      M[i] = i
    }

    M = ctx.ECDH.ECIES_DECRYPT(sha, P1, P2, V, C, T, privKey)
    if (M.length === 0) {
      console.error('ECIES Decryption Failed')
    } else {
      const base = await bytesToString(M)
      const out = Buffer.from(base, 'base64').toString('ascii')
      return out
    }
  }
  return null
}

module.exports = decryptECDH
