const aesDecrypt = async (ctx, mode, K, C, IV) => {
  const a = new ctx.AES()
  let i, ipt, opt, ch
  const buff = []
  const MM = []
  let fin, bad
  let padlen
  ipt = opt = 0

  a.init(mode, K.length, K, IV);

  if (C.length === 0) {
    return []
  }
  ch = C[ipt++]

  fin = false

  for (;;) {
    for (i = 0; i < 16; i++) {
      buff[i] = ch
      if (ipt >= C.length) {
        fin = true
        break
      } else {
        ch = C[ipt++]
      }
    }
    a.decrypt(buff)
    if (fin) {
      break
    }
    for (i = 0; i < 16; i++) {
      MM[opt++] = buff[i]
    }
  }

  a.end()
  bad = false
  padlen = buff[15]
  if (i !== 15 || padlen < 1 || padlen > 16) {
    bad = true
  }

  if (padlen >= 2 && padlen <= 16) {
    for (i = 16 - padlen; i < 16; i++) {
      if (buff[i] != padlen) {
        bad = true
      }
    }
 }

  // if (!bad)
  for (i = 0; i < 16; i++) {
    MM[opt++] = buff[i]
  }

  const M = []
  if (bad) {
    return M
  }

  for (i = 0; i < opt; i++) {
    M[i] = MM[i]
  }
  return MM
}

module.exports = aesDecrypt
