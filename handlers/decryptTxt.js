const Promise = require('bluebird')
const path = require('path')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const decryptECDH = require('../utils/decryptECDH')
const stringToHex = require('../utils/stringToHex')
const mkdirpAsync = Promise.promisify(require('mkdirp'))

const schema = Joi.object().keys({
  pathname: Joi.string().alphanum(),
  user: Joi.string().alphanum().min(42).max(42),
  text: Joi.string().alphanum()
}).with('pathname', ['user', 'secretOwner', 'text'])

const decryptTxt = async (req, res) => {
  Joi.validate(req.body.data, schema, async (err, val) => {
    if (err) {
      // JSON.stringify({ res: 400, error: err.message })
    }
    const privkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pk', `${req.body.data.user}`)
    if (fs.existsSync(privkeyLoc)) {
      fs.readFile(privkeyLoc, 'ascii', async (er, privKey) => {
        if (!er) {
          const decoded = await decryptECDH(privKey, req.body.data.text)
          res.status(200).send(JSON.stringify({ data: decoded }))
        }
      })
    }
  })
}

module.exports = decryptTxt
