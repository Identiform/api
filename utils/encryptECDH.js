const CTX = require('milagro-crypto-js')
const hexToBytes = require('./hexToBytes')
const stringToBytes = require('./stringToBytes')
const genRng = require('./genRng')
const genKeyPair = require('./genKeyPair')
const bytesToHex = require('./bytesToHex')

const encryptECDH = async (priv, message) => {
  const ctx = new CTX('BN254')
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
  const privKey = await hexToBytes(priv)
  const pubKey = await genKeyPair(ctx, privKey)
  const res = ctx.ECDH.PUBLIC_KEY_VALIDATE(pubKey)
  if (res !== 0) {
    console.error('ECP Public Key is invalid!')
  } else {
    const msg = await stringToBytes(message)
    const ciphertext = ctx.ECDH.ECIES_ENCRYPT(sha, P1, P2, rng, pubKey, msg, V, T)

    return JSON.stringify({
      v: await bytesToHex(V),
      c: await bytesToHex(ciphertext),
      t: await bytesToHex(T)
    })
  }
  return null
}

module.exports = encryptECDH
