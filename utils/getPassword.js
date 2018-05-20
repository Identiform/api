function getPassword(ctx, password) {
  return ctx.ECDH.stringtobytes(password)
}

module.exports = getPassword
