const ACTIONS = require('../actions')

const handlers = {
  [ACTIONS.USERS.REGISTER]: require('./userRegister'),
  [ACTIONS.USERS.GET]: require('./userGet'),
  [ACTIONS.EMAIL.SEND]: require('./sendEmail'),
  [ACTIONS.KEYS.GENERATE]: require('./genKey.js'),
  [ACTIONS.KEYS.ENCRYPT.ECDSA]: require('./notImplemented'),
  [ACTIONS.KEYS.ENCRYPT.ECDH]: require('./encryptTxt'),
  [ACTIONS.KEYS.DECRYPT.ECDH]: require('./decryptTxt')
}

module.exports = handlers
