const bytesToHex = async (bytes) => {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2)
  }).join('')
}

module.exports = bytesToHex
