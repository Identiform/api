const ACTIONS = require('../actions')

const handlers = {
  [ACTIONS.USERS.REGISTER]: require('./userRegister'),
  [ACTIONS.USERS.GET]: require('./userGet'),
  [ACTIONS.EMAIL.SEND]: require('./sendEmail'),
  [ACTIONS.KEYS.GENERATE]: require('./genKey.js'),
  [ACTIONS.KEYS.ENCRYPT]: require('./encryptTxt')
}

module.exports = handlers
