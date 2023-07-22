const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require("./config");


module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.email.split('@')[0];
    this.url = url;
    this.from = `SVSG <${config.EMAIL_FROM}>`;
    this.role = user.role;
  }

  newTransport() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.GMAIL,
          pass: config.GMAIL_PASSWORD
        }
      })

  }

  async send(template, subject) {
    //Send the actual email
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      url: this.url,
      role : this.role,
      subject
    });
    // console.log(html);
    //2) Define email options
    const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text: htmlToText.htmlToText(html)
    // html:
    }

    // 3)Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    //await transporter.sendMail(mailOptions);
  }

  async sendInvite() {
   await this.send(`inviteEmail`, `Welcome to SVSG!`)
  }
}