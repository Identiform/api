const nodemailer = require('nodemailer')

const apiKey = process.env.NODE_ENV === 'testing' ? 'test' : process.env.REACT_APP_API_KEY

const createTestAccount = () => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message)
      return process.exit(1)
    }

    console.log('Credentials obtained for test account', account)

    return account
  })
}

let mailConfig
if (process.env.NODE_ENV === 'testing') {
  mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'zovw4qtl7zcy6lpj@ethereal.email',
      pass: 'DraqNYc4jsHXcRtHAw'
    },
    logger: false,
    debug: true
  }
} else {
  mailConfig = {
    host: process.env.REACT_APP_EMAIL_HOST,
    port: process.env.REACT_APP_EMAIL_PORT,
    secure: process.env.REACT_APP_EMAIL_SECURE,
    auth: {
      user: process.env.REACT_APP_EMAIL_USER,
      pass: process.env.REACT_APP_EMAIL_PASSWORD
    },
    logger: false,
    debug: false
  }
}

let transporter = nodemailer.createTransport(mailConfig, { from: 'identiForm <no-reply@identiform.com>' })

const sendEmail = (req, res) => {
  if (req.body.data.apiKey === apiKey) {
    transporter = nodemailer.createTransport(mailConfig)

    transporter.sendMail(req.body.data.email, (error, info) => {
      if (error) {
        console.log(error)
      }

      transporter.close()

      res.setHeader('Content-Type', 'application/json')
      res.status(200).send(JSON.stringify({ result: 'done', messageSize: info.messageSize }))
    })
  }
}

module.exports = sendEmail
module.exports.createTestAccount = createTestAccount
