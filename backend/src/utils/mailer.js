import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL_USER, 
    pass: process.env.MAILER_EMAIL_PASS,
  },
  pool: true,
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Kontribute" <${process.env.MAILER_EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, 
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message); 
  }
}

export const sendVerificationCodeViaEmail = async (to, subject, code) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f9;
          color: #333333;
        }
        .email-container {
          max-width: 550px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef2f5;
        }
        .email-header {
          background-color: #1a1a2e;
          padding: 30px;
          text-align: center;
        }
        .email-header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .email-header h1 span {
          color: #00adb5;
        }
        .email-body {
          padding: 40px 30px;
          text-align: center;
          line-height: 1.6;
        }
        .email-body p {
          font-size: 16px;
          color: #555555;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .code-container {
          background-color: #f8fafc;
          border: 2px dashed #00adb5;
          border-radius: 8px;
          padding: 20px;
          margin: 30px auto;
          max-width: 280px;
        }
        .verification-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #1a1a2e;
          margin: 0;
        }
        .expiry-text {
          font-size: 13px;
          color: #888888;
          margin-bottom: 0;
        }
        .email-footer {
          background-color: #fafbfc;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #eef2f5;
        }
        .email-footer p {
          font-size: 12px;
          color: #aaaaaa;
          margin: 5px 0;
        }
        .credit {
          font-weight: 600;
          color: #777777 !important;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1><span>Kon</span>tribute</h1>
        </div>

        <div class="email-body">
          <p>Thank you for signing up! To complete your registration and secure your account, please verify your email address using the validation code below.</p>
          
          <div class="code-container">
            <h2 class="verification-code">${code}</h2>
          </div>

          <p class="expiry-text">This code is valid for 15 minutes. If you did not request this verification, please safely ignore this email.</p>
        </div>

        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} Kontribute. All rights reserved.</p>
          <p class="credit">Engineered by AkiraCode</p>
        </div>
      </div>
    </body>
    </html>
  `; 
  
  try {
    await sendEmail(to, subject, html);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message); 
  }
};