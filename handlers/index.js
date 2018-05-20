const ACTIONS = require('../actions')

const handlers = {
  [ACTIONS.USERS.REGISTER]: require('./userRegister'),
  [ACTIONS.USERS.GET]: require('./userGet'),
  [ACTIONS.EMAIL.SEND]: require('./sendEmail'),
  [ACTIONS.KEYS.GENERATE]: require('./genKeypair.js'),
  [ACTIONS.KEYS.ENCRYPT]: require('./encrypt')
}

module.exports = handlers
