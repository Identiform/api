const genRng = async (ctx) => {
  const RAW = []
  const rng = new ctx.RAND()

  rng.clean()
  for (let i = 0; i < 100; i++) {
    RAW[i] = i
  }

  rng.seed(100, RAW)

  return rng
}

module.exports = genRng
