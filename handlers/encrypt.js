const Promise = require( 'bluebird')
const path = require('path')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const Buffer = require('safe-buffer').Buffer
const bitcore = require('bitcore-lib')

function encrypt(req, res) {
  console.log('enc')
  console.log(req)
  const schema = Joi.object().keys({
    pathname: Joi.string().alphanum().required(),
    user: Joi.string().alphanum().min(42).max(42).required(),
    text: Joi.string().alphanum().required()
  }).with('pathname', 'user')
  Joi.validate(req, schema, (err, val) => {
    if (err) {
      res.send(JSON.stringify({ res: 400, error: err.message }, null, 4))
    }
    const pubkeyLoc = path.join(req.pathname, `${req.user}_pubkey.pub`)
    const privkeyLoc = path.join(req.pathname, `${process.env.OWNER}_privkey.pem`)
    const pubKey = fs.readFileSync(pubkeyLoc)
    const privKey = fs.readFileSync(privkeyLoc)
    const data = new Buffer(req.text, 'utf8')
    const owner = bitcore.ECIES().privateKey(privKey).publicKey(pubKey)
    const encoded = owner.encrypt(req.text)
    res.send(JSON.stringify({ data: encoded }, null, 4))
  })
}

module.exports = encrypt
