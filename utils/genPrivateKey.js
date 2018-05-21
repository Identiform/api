const genSalt = require('./genSalt')
const getPassword = require('./getPassword')

async function genPrivateKey(ctx, pass) {
  return ctx.ECDH.PBKDF2(ctx.ECDH.HASH_TYPE, await getPassword(ctx, pass), await genSalt(ctx), 1000, ctx.ECDH.EGS)
}

module.exports = genPrivateKey
