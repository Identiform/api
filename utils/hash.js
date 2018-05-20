const CTX = require('milagro-crypto-js')
const stringToBytes = require('./stringToBytes')
const bytesToString = require('./bytesToString')

async function hash(text) {
  const B = stringToBytes(text)
  const ctx = new CTX()
  const sha = ctx.HASH256.len
  let R = []
  let H

  if (sha == ctx.HASH256.len) {
    H = new ctx.HASH256()
  } else if (sha === ctx.HASH384.len) {
    H = new ctx.HASH384()
  } else if (sha === ctx.HASH512.len) {
    H = new ctx.HASH512()
  }

  H.process_array(B)
  R = H.hash()

  if (R.length === 0) {
    return null
  }

  return bytesToString(R)
}

module.exports = hash
