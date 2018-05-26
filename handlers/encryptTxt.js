const Promise = require('bluebird')
const path = require('path')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const encryptECDH = require('../utils/encryptECDH')
const mkdirpAsync = Promise.promisify(require('mkdirp'))

const schema = Joi.object().keys({
  pathname: Joi.string().alphanum(),
  user: Joi.string().alphanum().min(42).max(42),
  text: Joi.string().alphanum()
}).with('pathname', ['user', 'secretOwner', 'text'])

const encryptTxt = async (req, res) => {
  res.set('content-type', 'application/json; charset=utf8')
  Joi.validate(req.body.data, schema, async (err, val) => {
    if (err) {
      // res.status(500).send(JSON.stringify({ res: 400, error: err.message }, null, 4))
    }
    const pubkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pub', `${req.body.data.user}`)
    if (fs.existsSync(pubkeyLoc)) {
      fs.readFile(pubkeyLoc, 'ascii', async (er, pubKey) => {
        if (!er) {
          const encoded = await encryptECDH(pubKey, req.body.data.text)
          res.status(200).send(JSON.stringify({ data: encoded }))
        }
      })
    }
  })
}

module.exports = encryptTxt
