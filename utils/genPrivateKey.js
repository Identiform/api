const genSalt = require('./genSalt')
const getPassword = require('./getPassword')

const genPrivateKey = async (ctx, password) => {
  const salt = await genSalt()
  const pass = await getPassword(ctx, password)
  return ctx.ECDH.PBKDF2(ctx.ECDH.HASH_TYPE, pass, salt, 1000, ctx.ECDH.EGS)
}

module.exports = genPrivateKey
