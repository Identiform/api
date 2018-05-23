const CTX = require('milagro-crypto-js')
const bytesToString = require('./bytesToString')
const hexToBytes = require('./hexToBytes')

const decryptECDH = async (priv, v, c, t) => {
  const ctx = new CTX('BN254')
  const sha = ctx.ECDH.HASH_TYPE

  const P1 = []
  const P2 = []
  P1[0] = 0x0
  P1[1] = 0x1
  P1[2] = 0x2
  P2[0] = 0x0
  P2[1] = 0x1
  P2[2] = 0x2
  P2[3] = 0x3

  const C = await hexToBytes(c)
  const V = await hexToBytes(v)
  const T = await hexToBytes(t)
  const privKey = await hexToBytes(priv)

  const deciphered = ctx.ECDH.ECIES_DECRYPT(sha, P1, P2, V, C, T, privKey)
  if (deciphered.length === 0) {
    console.error('ECIES Decryption Failed')
  } else {
    console.log('Decryption succeeded')
    const decpoded = await bytesToString(deciphered)
    return decpoded
  }
  return null
}

module.exports = decryptECDH
