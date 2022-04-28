const nodemailer = require("nodemailer");

sendMail = (mailsto, subject, output) => {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "recruteemail@gmail.com",
      pass: "Recrute2022",
    },
  });

  var mails = "";
  if (Array.isArray(mailsto)) {
    if (mailsto.length == 1) {
      mails = mailsto[0].email;
    } else
      mailsto.map((admin) => {
        mails += admin.email + ",";
      });
  } else {
    mails = mailsto;
  }

  let mailOptions = {
    from: "recruteOffer@gmail.com",
    to: mails,
    subject: subject,
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error.message);
    }
    console.log("success");
  });
};

module.exports = { sendMail };
