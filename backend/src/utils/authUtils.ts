import bcrypt from "bcryptjs"
import crypto from "crypto"

import { TokenTypes, TOKEN_EXPIRATION_IN_MS } from "../models/token.model"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(input: string, password: string) {
  return bcrypt.compare(input, password)
}

export const generateCryptoToken = () => {
  const TOKEN_BYTES = 32; // 256 bits of entropy

  return crypto.randomBytes(TOKEN_BYTES).toString('hex')
}

export function generateSixDigitCode(){
   return crypto.randomInt(100000, 999999)
}

export function getTokenExpirationDate(
  tokenType: TokenTypes,
  fromDate: Date = new Date()
): Date {
  const durationInMs = TOKEN_EXPIRATION_IN_MS[tokenType]
  return new Date(fromDate.getTime() + durationInMs)
}