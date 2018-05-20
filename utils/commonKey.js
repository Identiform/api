function commonKey(ctx, privKey0, privKey1, pubKey0, pubKey1) {
  const Z0 = []
  const Z1 = []
  ctx.ECDH.ECPSVDP_DH(privKey0, pubKey1, Z0)
  ctx.ECDH.ECPSVDP_DH(privKey1, pubKey0, Z1)

  let same = true
  for (let i = 0; i < ctx.ECDH.EFS; i++) {
    if (Z0[i] !== Z1[i]) {
      same = false
    }
  }

  if (!same) {
    console.error('ECP_ZZZSVDP-DH Failed')
    commonKey(ctx, privKey0, privKey1, pubKey0, pubKey1)
  }

  return ctx.ECDH.KDF2(ctx.ECDH.HASH_TYPE, Z0, null, ctx.ECDH.EAS)
}

module.exports = commonKey
