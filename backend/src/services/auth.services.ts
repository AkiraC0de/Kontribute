import { HydratedDocument } from "mongoose"

import { BadRequestMsgError } from "../core/ApiError"
import { hashPassword } from "../utils/authUtils"
import User, { UserType } from "../models/user.model"

export async function registerUser(userData : Pick<UserType, "email" | "password">): Promise<Record<string, any>>  {
  const { email, password } = userData
  const existingUser = await User.findOne({ email })

  if (existingUser) return handleRegistrationEmailConflict(existingUser, password)
 
  const hashedPassword = await hashPassword(password)
  await User.create({
    email,
    password: hashedPassword
  })

  return { 
    message: "Verification OTP has been sent. Please check your email's inbox.",
    data: { email }
  }
}

async function handleRegistrationEmailConflict(
  existingUser: HydratedDocument<UserType>, 
  password: string
) {
  if (existingUser.isEmailVerified) throw new BadRequestMsgError("Email is already registered.")

  return handleUnverifiedRegistration(existingUser, password)
}

async function handleUnverifiedRegistration(
  existingUser: HydratedDocument<UserType>, 
  password: string
) {
  existingUser.password = await hashPassword(password)
  await existingUser.save()
  
  // await sendVerificationEmail(existingUser);
  return { 
    message: "Verification OTP resent. Please check your email's inbox.",
    data: { email: existingUser.email }
  }
}