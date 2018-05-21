const Promise = require( 'bluebird')
const path = require('path')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const Buffer = require('safe-buffer').Buffer
const bitcore = require('bitcore-lib')

async function encrypt(req, res) {
  const schema = Joi.object().keys({
    pathname: Joi.string().alphanum(),
    user: Joi.string().alphanum().min(42).max(42),
    text: Joi.string().alphanum()
  }).with('pathname', 'user', 'text')
  Joi.validate(req, schema, (err, val) => {
    if (err) {
      res.status(500).send(JSON.stringify({ res: 400, error: err.message }, null, 4))
    }
    const pubkeyLoc = path.join(req.body.data.pathname, 'pub', `${req.body.data.user}`)
    const privkeyLoc = path.join(req.body.data.pathname, 'pk', `${req.body.data.secretOwner}`)
    const pubKey = fs.readFileSync(pubkeyLoc)
    const privKey = fs.readFileSync(privkeyLoc)
    const data = new Buffer(req.body.data.text, 'utf8')
    const owner = bitcore.ECIES().privateKey(privKey).publicKey(pubKey)
    const encoded = owner.encrypt(req.text)
    res.send(JSON.stringify({ data: encoded }, null, 4))
  })
}

module.exports = encrypt
