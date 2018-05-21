async function stringToBytes(s) {
  const b = []
  for (let i = 0; i < s.length; i++) {
    b.push(s.charCodeAt(i))
  }
  return b
}

module.exports = stringToBytes
