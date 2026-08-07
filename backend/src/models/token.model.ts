import { NextFunction } from "express"
import mongoose, { Schema, model, InferSchemaType } from "mongoose"

// NOTES:
// -DELETED token means invalid
// -Automatically deletes after expiration

export const TOKEN_TYPE = {
  REFRESH_TOKEN: "refresh_token",           // Required to get an accessToken(JWT) without having to login
  EMAIL_VERIFICATION: "email_verification", // required to accept the OTP and verify the email
  REQ_RESET_PASS: "request_reset_password", // required for getting a "reset_password" token
  RESET_PASS: "reset_password",             // required for actually resetting a password
} as const

export const TOKEN_EXPIRATION_IN_SECONDS = {
  [TOKEN_TYPE.REFRESH_TOKEN]: 30 * 24 * 60 * 60, // 30 days
  [TOKEN_TYPE.EMAIL_VERIFICATION]: 5 * 60,       // 5 mins
  [TOKEN_TYPE.REQ_RESET_PASS]: 15 * 60,          // 15 minutes
  [TOKEN_TYPE.RESET_PASS]: 15 * 60,              // 15 minutes
} as const 

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(TOKEN_TYPE),
    required: true
  },
  token: {
    type: String,
    required: true
  },
  payload: { // can ba used for token that needs a payload. Ex: "email_verification" needs an OTP together
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // Automatically deletes after expiration
tokenSchema.index({ userId: 1, type: 1 })

export type TokenType = InferSchemaType<typeof tokenSchema>

const Token = model("RefreshToken", tokenSchema)
export default Token