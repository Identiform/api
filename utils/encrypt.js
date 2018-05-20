const CTX = require('milagro-crypto-js')
const hexToBytes = require('./hexToBytes')
const bytesToString = require('./bytesToString')

function encrypt(key, text) {
  const K = hexToBytes(key)
  const M = hexToBytes(text)
  const ctx = new CTX()
  const mode = ctx.AES.ECB
  const a = new ctx.AES()
  let fin
  let i, j, ipt, opt
  const buff = []
  const C = []
  const padlen = 16 - i

  a.init(mode, K.length, K, null)

  ipt = opt = 0
  fin = false
  for (;;) {
    for (i = 0; i < 16; i++) {
      if (ipt < M.length) {
        buff[i] = M[ipt++]
      } else {
        fin = true
        break
      }
    }
    if (fin) {
      break
    }
    a.encrypt(buff)
    for (i = 0; i < 16; i++) {
      C[opt++] = buff[i]
    }
  }

  for (j = i; j < 16; j++) {
    buff[j] = padlen
  }
  a.encrypt(buff)
  for (i = 0; i < 16; i++) {
    C[opt++] = buff[i]
  }
  a.end()
  return bytesToString(C)
}

module.exports = encrypt
