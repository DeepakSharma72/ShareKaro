const nodemailer = require('nodemailer');


async function sendEmail({ from, to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail(
        {
            from: `ShareKaro<${from}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        },(error,info) => {
            if(error)
            {
                console.log("error", error);
            }
            else
            {
                console.log("success", info);
            }
        }
    )
}

module.exports = sendEmail;