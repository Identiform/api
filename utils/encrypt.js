const ECIES = require('bitcore-ecies')

const encrypt = async (priv, pub, txt) => {
  const ecies = ECIES().privateKey(priv).publicKey(pub)
  return ecies.encrypt(txt)
}

module.exports = encrypt
