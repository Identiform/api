async function bytesToString(b) {
  let s = ''
  const len = b.length
  let char

  for (let i = 0; i < len; i++) {
    char = b[i]
    s += String.fromCharCode(char)
  }

  return s
}

module.exports = bytesToString
