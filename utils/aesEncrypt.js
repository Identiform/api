const aesEncrypt = async (ctx, mode, K, M) => {
  const a = new ctx.AES()
  let fin
  let i, j, ipt, opt
  const buff = []
  const C = []
  let padlen
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
    a.encrypt(buff);
    for (i = 0; i < 16; i++) {
      C[opt++] = buff[i]
    }
  }

  padlen = 16 - i
  for (j = i; j < 16; j++) {
    buff[j] = padlen
  }
  a.encrypt(buff)
  for (i = 0; i < 16; i++) {
    C[opt++] = buff[i]
  }
  a.end()
  return C
}

module.exports = aesEncrypt
