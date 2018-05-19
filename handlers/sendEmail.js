const nodemailer = require('nodemailer')

async function sendEmail(req, res) {
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
      console.log('Error occurred')
      console.log(error.message)
      return process.exit(1)
    }

    console.log('Message sent successfully!')
    console.log(info)

    transporter.close()

  })
}
