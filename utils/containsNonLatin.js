const containsNonLatin = async (s) => {
  return /[^\u0000-\u00ff]/.test(s)
}

module.exports = containsNonLatin
