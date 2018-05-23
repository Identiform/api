const hexToBytes = async (value) => {
  const byteValue = []
  const len = value.length

  for (let i = 0; i < len; i += 2) {
    byteValue[(i / 2)] = parseInt(value.substr(i, 2), 16)
  }

  return byteValue
}

module.exports = hexToBytes
