const nodemailer = require("nodemailer")

const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,    //transport layer security
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})
module.exports = mailer