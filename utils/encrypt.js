const crypto = require('crypto')
const algorithm = 'aes-256-ctr'

async function encrypt(password, text) {
  const cipher = await crypto.createCipher(algorithm, password)
  let crypted = await cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

module.exports = encrypt
