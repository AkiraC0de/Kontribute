import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL_USER, 
    pass: process.env.MAILER_EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Kontribute" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, 
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message); 
  }
}