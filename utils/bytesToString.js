async function bytesToString(b) {
  let s = ''
  const len = b.length
  let ch

  for (let i = 0; i < len; i++) {
    ch = b[i]
    s += ((ch >>> 4) & 15).toString(16)
    s += (ch & 15).toString(16)
  }

  return s
}

module.exports = bytesToString
