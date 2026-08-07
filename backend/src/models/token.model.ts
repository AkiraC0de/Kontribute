import { NextFunction } from "express"
import mongoose, { Schema, model, InferSchemaType, HydratedDocument } from "mongoose"

// NOTES:
// -DELETED token means invalid
// -Automatically deletes after expiration

export const TOKEN_TYPE = {
  REFRESH_TOKEN: "refresh_token",           // Required to get an accessToken(JWT) without having to login
  EMAIL_VERIFICATION: "email_verification", // required to accept the OTP and verify the email
  REQ_RESET_PASS: "request_reset_password", // required for getting a "reset_password" token
  RESET_PASS: "reset_password",             // required for actually resetting a password
} as const

export const TOKEN_EXPIRATION_IN_MS = {
  [TOKEN_TYPE.REFRESH_TOKEN]: 30 * 24 * 60 * 60 * 1000, // 30 days
  [TOKEN_TYPE.EMAIL_VERIFICATION]: 10 * 60 * 1000,      // 10 mins
  [TOKEN_TYPE.REQ_RESET_PASS]: 15 * 60 * 1000,          // 15 minutes
  [TOKEN_TYPE.RESET_PASS]: 15 * 60 * 1000,              // 15 minutes
} as const 

export type TokenTypes = typeof TOKEN_TYPE[keyof typeof TOKEN_TYPE]

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: false,
})

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // Automatically deletes after expiration
tokenSchema.index({ userId: 1, type: 1 })

export type TokenType = InferSchemaType<typeof tokenSchema>

export type TokenDocument = HydratedDocument<TokenType>

const Token = model("Token", tokenSchema)
export default Token