const getPassword = async (ctx, password) => {
  return ctx.ECDH.stringtobytes(password)
}

module.exports = getPassword
