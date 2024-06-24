const nodemailer = require('nodemailer');
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // Ensure this is the correct port for your SMTP server
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const info = await transporter.sendMail({
            from: "StudyNotion || CodeHelp- by Babbar",
            to:`${email}`,
            subject:`${title}`,
            html: `${body}`
        })

        console.log("Info from mailSender",info);
        return info;


    }
    catch (error) {
        console.log(error.message)
    }
}


module.exports = mailSender;