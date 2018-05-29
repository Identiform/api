const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const mkdirpAsync = Promise.promisify(require('mkdirp'))

const delKey = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  const mLoc = path.join(process.cwd(), req.body.data.pathname, 'mem', `${req.body.data.user}`)
  const privkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pk', `${req.body.data.user}`)
  const pubkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pub', `${req.body.data.user}`)

  if (!fs.existsSync(pubkeyLoc)) {
    return Promise.all([
      fs.unlinkSync(privkeyLoc),
      fs.unlinkSync(pubkeyLoc),
      fs.unlinkSync(mLoc)
    ]).then(() => {
      res.status(200).send(JSON.stringify({ result: 'done' }))
    })
  }
}

module.exports = delKey
