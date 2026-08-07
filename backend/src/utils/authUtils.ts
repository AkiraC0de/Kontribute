import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(input: string, password: string) {
  return bcrypt.compare(input, password)
}

export function generateSixDigitCode(){
   return crypto.randomInt(100000, 999999);
}