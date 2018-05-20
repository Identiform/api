async function genKeyPair(ctx, privKey) {
  const pubKey = []
  ctx.ECDH.KEY_PAIR_GENERATE(null, privKey, pubKey)
  const res = ctx.ECDH.PUBLIC_KEY_VALIDATE(pubKey)
  if (res !== 0) {
    console.error('PubKey is invalid!')
    genKeyPair(ctx, privKey)
  }
  return pubKey
}

module.exports = genKeyPair
