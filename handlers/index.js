const ACTIONS = require('../actions')

const handlers = {
  [ACTIONS.USERS.REGISTER]: require('./userRegister.js'),
  [ACTIONS.USERS.GET]: require('./userGet.js'),
  [ACTIONS.EMAIL.SEND]: require('./sendEmail.js')
}
