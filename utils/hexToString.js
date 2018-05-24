const hexToString = async (hex) => {
  hex = hex.toString()
  let out = ''
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return out.replace(/\0/g, '')
}

module.exports = hexToString
