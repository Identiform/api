const notImplemented = async (req, res) => {
  res.set('content-type', 'application/json; charset=utf8')
  res.status(500)
}

module.exports = notImplemented
