const Promise = require('bluebird')
const Joi = require('joi')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const bip39 = require('bip39')
const mkdirpAsync = Promise.promisify(require('mkdirp'))
const CTX = require('milagro-crypto-js')
const genKeyPair = require('../utils/genKeyPair')
const genPrivateKey = require('../utils/genPrivateKey')
const bytesToString = require('../utils/bytesToString')

const genKey = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const schema = Joi.object().keys({
    pathname: Joi.string().alphanum(),
    user: Joi.string().alphanum().min(42).max(42)
  }).with('pathname', 'user')
  Joi.validate(req.body.data, schema, async (err, val) => {
    if (err) {
      // res.status(500).send(JSON.stringify({ error: err.message }))
    }
    const code = bip39.generateMnemonic()
    const mnemHex = bip39.mnemonicToSeedHex(code)
    const ctx = new CTX('BN254')
    const privKey = await genPrivateKey(ctx, mnemHex)
    const pubKey = await genKeyPair(ctx, privKey)
    const privKeyStr = await bytesToString(privKey)
    const pubKeyStr = await bytesToString(pubKey)
    const mLoc = path.join(process.cwd(), req.body.data.pathname, 'mem', `${req.body.data.user}`)
    const privkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pk', `${req.body.data.user}`)
    const pubkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pub', `${req.body.data.user}`)

    return mkdirpAsync(req.body.data.pathname).then(() => {
      // Check if pub key exists, because private keys are offline
      if (!fs.existsSync(pubkeyLoc)) {
        return Promise.all([
          fs.writeFileAsync(privkeyLoc, privKeyStr, 'ascii'),
          fs.writeFileAsync(pubkeyLoc, pubKeyStr, 'ascii'),
          fs.writeFileAsync(mLoc, mnemHex, 'ascii')
        ])
      }
      return null
    }).then(() => {
      res.status(200).send(JSON.stringify({ result: 'done' }))
    }).catch((e) => {
      res.status(500).send(JSON.stringify({ error: e.message }))
    })
  })
}

module.exports = genKey
