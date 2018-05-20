const Promise = require('bluebird')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const Mnemonic = require('bitcore-mnemonic')
const mkdirpAsync = Promise.promisify(require('mkdirp'))
const CTX = require('milagro-crypto-js')
const genKeyPair = require('../utils/genKeyPair')
const genPrivateKey = require('../utils/genPrivateKey')
const hash = require('../utils/hash')

async function genKeypair(req, res) {
  const schema = Joi.object().keys({
    [req.body.data.pathname]: Joi.string().alphanum(),
    [req.body.data.user]: Joi.string().alphanum().min(42).max(42)
  }).with('pathname', 'user')
  Joi.validate(req, schema, async (err, val) => {
    if (err) {
      res.send(JSON.stringify({ error: err.message }, null, 4))
    }
    const code = new Mnemonic()
    const mnemHash = await hash(code.toString())
    const ctx = new CTX('BN254')
    const privKey = await genPrivateKey(ctx, mnemHash)
    const pubKey = await genKeyPair(ctx, privKey)
    const mLoc = path.join(req.body.data.pathname, 'mem', `${req.body.data.user}_m`)
    const privkeyLoc = path.join(req.body.data.pathname, 'pk', `${req.body.data.user}_privkey.pem`)
    const pubkeyLoc = path.join(req.body.data.pathname, 'pub', `${req.body.data.user}_pubkey.pub`)

    return mkdirpAsync(req.body.data.pathname).then(() => {
      // Check if pub key exists, because private keys are offline
      if (!fs.existsSync(pubkeyLoc)) {
        return Promise.all([
          fs.writeFileAsync(privkeyLoc, privKey, 'ascii'),
          fs.writeFileAsync(pubkeyLoc, pubKey, 'ascii'),
          fs.writeFileAsync(mLoc, mnemHash, 'ascii')
        ])
      }
      return null
    }).then(() => {
      res.send(JSON.stringify({ result: 200 }, null, 4))
    }).catch((e) => {
      res.send(JSON.stringify({ error: e.message }, null, 4))
    })
  }).catch((e) => {
    res.send(JSON.stringify({ error: e.message }, null, 4))
  })
}

module.exports = genKeypair
