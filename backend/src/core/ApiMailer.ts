import nodemailer from "nodemailer"
import { FailedEmailError, InternalError } from "./ApiError"

// For resuable in other project purposes
const APP_NAME = "Kontribute"

export class ApiMailer {
  private static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_EMAIL_USER,
      pass: process.env.MAILER_EMAIL_PASS,
    },
    pool: true,
  })

  // Private base method handles lower-level nodemailer calls
  private static async send(to: string, subject: string, html: string) {
    const sender = process.env.MAILER_EMAIL_USER
    if (!sender) throw new InternalError("MAILER_EMAIL_USER missing in env.")

    try {
      return await this.transporter.sendMail({
        from: `${APP_NAME} <${sender}>`,
        to,
        subject,
        html,
      })
    } catch (error) {
      throw new FailedEmailError(`Failed to send an email to <${to}>.`)
    }
  }

  public static async sendOTP(receiver: string, otp: string, subject: string = "Verification code") {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
    return this.send(receiver, subject, html)
  }

  public static async sendWelcome(receiver: string, name: string) {
    const subject = `Welcome aboard, ${name}!`
    const html = `<h1>Welcome, ${name}!</h1><p>We are glad to have you.</p>`
    return this.send(receiver, subject, html)
  }
}