const nodemailer = require('nodemailer')

function sendEmail(req, res) {
  console.log('em')
  console.log(req)
  const transporter = nodemailer.createTransport({
    host: process.env.REACT_APP_EMAIL_HOST,
    port: process.env.REACT_APP_EMAIL_PORT,
    secure: process.env.REACT_APP_EMAIL_SECURE,
    auth: {
      user: process.env.REACT_APP_EMAIL_USER,
      pass: process.env.REACT_APP_EMAIL_PASSWORD
    },
    logger: false,
    debug: false
  },
  {
    from: 'identiForm <no-reply@identiform.com>'
  }
  )

  transporter.sendMail(req.body, (error, info) => {
    if (error) {
      res.send(JSON.stringify({ res: 400, error: error.message }, null, 4))
    }

    transporter.close()
    res.send(JSON.stringify({ res: 200 }, null, 4))
  })
}

module.exports = sendEmail
