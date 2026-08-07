import { Types } from "mongoose"

import { BadRequestMsgError } from "../core/ApiError"

import { 
  hashPassword, 
  generateSixDigitCode, 
  getTokenExpirationDate, 
  generateCryptoToken 
} from "../utils/authUtils"

import User, { UserType, UserDocument } from "../models/user.model"
import Token, { TOKEN_TYPE, TokenType } from "../models/token.model"

export async function registerUser(userData : Pick<UserType, "email" | "password">): Promise<Record<string, any>>  {
  const { email, password } = userData
  const existingUser = await User.findOne({ email })

  if (existingUser) return handleRegistrationEmailConflict(existingUser, password)
 
  const hashedPassword = await hashPassword(password)
  const newUser = await User.create({
    email,
    password: hashedPassword
  })
  const token = await issueEmailVerificationToken(newUser._id)

  // await sendVerificationEmail(existingUser);
  return { 
    message: "Verification OTP has been sent. Please check your email's inbox.",
    data: { email, token }
  }
}

async function handleRegistrationEmailConflict(
  existingUser: UserDocument,
  password: string
) {
  if (existingUser.isEmailVerified) throw new BadRequestMsgError("Email is already registered.")

  return handleUnverifiedRegistration(existingUser, password)
}

async function handleUnverifiedRegistration(
  existingUser: UserDocument, 
  password: string
) {
  existingUser.password = await hashPassword(password)
  await existingUser.save()

  const token = await issueEmailVerificationToken(existingUser._id)
  
  // await sendVerificationEmail(existingUser);
  return { 
    message: "Verification OTP resent. Please check your email's inbox.",
    data: { email: existingUser.email, token }
  }
}

async function issueEmailVerificationToken( userId: Types.ObjectId | string ){
  return Token.create({
    userId,
    type: TOKEN_TYPE.EMAIL_VERIFICATION,
    token: generateCryptoToken(),
    payload: {
      otp: generateSixDigitCode(),
    },
    expiresAt: getTokenExpirationDate(TOKEN_TYPE.EMAIL_VERIFICATION),
  })
}