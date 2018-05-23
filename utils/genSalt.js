async function genSalt() {
  const SALT = []

  for (let i = 0; i < 8; i++) {
    SALT[i] = (i + 1)
  }

  return SALT
}

module.exports = genSalt
