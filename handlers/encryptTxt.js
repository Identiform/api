const Promise = require('bluebird')
const path = require('path')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const encrypt = require('../utils/encrypt')
const stringToHex = require('../utils/stringToBytes')
const mkdirpAsync = Promise.promisify(require('mkdirp'))

const schema = Joi.object().keys({
  pathname: Joi.string().alphanum(),
  user: Joi.string().alphanum().min(42).max(42),
  salt: Joi.string().alphanum().min(42).max(42),
  secretOwner: Joi.string().alphanum().min(42).max(42),
  text: Joi.string().alphanum()
}).with('pathname', ['user', 'secretOwner', 'text'])

const encryptTxt = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  Joi.validate(req.body.data, schema, async (err, val) => {
    if (err) {
      // res.status(500).send(JSON.stringify({ res: 400, error: err.message }, null, 4))
    }
    const pubkeyLoc = path.join(req.body.data.pathname, 'pub', `${req.body.data.user}`)
    const saltLoc = path.join(req.body.data.pathname, 'pub', `${req.body.data.salt}`)
    if (fs.existsSync(pubkeyLoc)) {
      fs.readFile(pubkeyLoc, 'ascii', async (er, pubKey) => {
        if (!er) {
          if (fs.existsSync(saltLoc)) {
            fs.readFile(pubkeyLoc, 'ascii', async (e, salt) => {
              if (!e) {
                const encoded = await encrypt(pubKey, salt, req.body.data.text)
                res.status(200).send(JSON.stringify({ data: encoded }))
              }
            })
          }
        }
      })
    }
  })
}

module.exports = encryptTxt
