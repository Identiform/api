const Promise = require('bluebird')
const Joi = require('joi')
const web3utils = require('web3-utils')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const bip39 = require('bip39')
const mkdirpAsync = Promise.promisify(require('mkdirp'))
const CTX = require('milagro-crypto-js')
const genKeyPair = require('../utils/genKeyPair')
const genPrivateKey = require('../utils/genPrivateKey')
const bytesToHex = require('../utils/bytesToHex')

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
    if (web3utils.isAddress(req.body.data.user)) {
      const code = bip39.generateMnemonic()
      const mnemHex = bip39.mnemonicToSeedHex(code)
      const ctx = new CTX('NIST256')
      const privKey = await genPrivateKey(ctx, mnemHex)
      const pubKey = await genKeyPair(ctx, privKey)
      const privKeyStr = await bytesToHex(privKey)
      const pubKeyStr = await bytesToHex(pubKey)
      const mLoc = path.join(process.cwd(), req.body.data.pathname, 'mem', `${req.body.data.user}`)
      const privkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pk', `${req.body.data.user}`)
      const pubkeyLoc = path.join(process.cwd(), req.body.data.pathname, 'pub', `${req.body.data.user}`)

      return mkdirpAsync(req.body.data.pathname).then(() => {
        if (!fs.existsSync(pubkeyLoc)) {
          return Promise.all([
            fs.writeFileAsync(privkeyLoc, privKeyStr, 'ascii'),
            fs.writeFileAsync(pubkeyLoc, pubKeyStr, 'ascii'),
            fs.writeFileAsync(mLoc, mnemHex, 'ascii')
          ])
        }
        res.status(500)
      }).then(() => {
        res.status(200).send(JSON.stringify({ result: 'done' }))
      }).catch((e) => {
        res.status(500).send(JSON.stringify({ error: e.message }))
      })
    }
  })
}

module.exports = genKey
