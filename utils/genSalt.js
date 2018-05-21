async function genSalt(ctx) {
  const SALT = []
  const RAW = []
  const rng = new ctx.RAND()

  rng.clean()
  for (let i = 0; i < 100; i++) {
    RAW[i] = i
  }

  rng.seed(100, RAW)

  for (let i = 0; i < 8; i++) {
    SALT[i] = (i + 1)
  }

  return SALT
}

module.exports = genSalt
