async function stringToHex(txt) {
  let hex
  let result = ''
  for (let i = 0; i < txt.length; i++) {
    hex = txt.charCodeAt(i).toString(16)
    result += (`000${hex}`).slice(-4)
  }

  return result
}
