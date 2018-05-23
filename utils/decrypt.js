const ECIES = require('bitcore-ecies')

const decrypt = async (priv, pub, txt) => {
  const ecies = ECIES().privateKey(priv).publicKey(pub)
  return ecies.decrypt(txt).toString()
}

module.exports = decrypt
