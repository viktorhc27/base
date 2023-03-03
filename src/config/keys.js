const nodemailer = require('nodemailer');

module.exports = {
    database: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST
    },
    debug: true,
    transport: nodemailer.createTransport({
        host: "mail.kuvesoft.cl",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: "sendmail@kuvesoft.cl",
            pass: "",
        }
    })
}