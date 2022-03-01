const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1cfc24dfe0c540",
      pass: "2e0820f5c134b4",
    },
  });

  const message = {
    from: "Emman Jay Dizon <emman@handsome.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(message);
};

module.exports = sendEmail;
