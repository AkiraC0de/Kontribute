import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import GenericError from "../errors/GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

import User from "../models/user.model.js";
import SessionToken from "../models/sessionToken.model.js";

import { generateCryptoToken, generateSixDigitCode } from "../utils/utils.js";
import Otp, { MAX_OTP_ATTEMPTS } from "../models/otp.model.js";
import { sendVerificationCodeViaEmail } from "../utils/mailer.js";
import { generateTokens } from "../utils/token.js";
import UserNotFound from "../errors/UserNotFound.js";

export const registerUser = async (userData) => {
  const { firstName, lastName, middleInitial, email, password} = userData;

  const existingUser = await User.findOne({email});
  
  // Check if the user already exist and is VERIFIED.
  if(existingUser && existingUser.isEmailVerified){
    throw new GenericError(400, "The email has already been registered.", ERROR_CODES.EMAIL_ALREADY_REGISTERED)
  }

  // If the user exist but are UNVERIFIED, delete the exisiting data
  if(existingUser && !existingUser.isEmailVerified){
    await Promise.all([
      existingUser.deleteOne(),
      SessionToken.deleteMany({ userId: existingUser._id}),
      Otp.deleteMany({ userId: existingUser._id})
    ]);
  }

  // hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    firstName,
    lastName,
    middleInitial,
    email,
    password: hashedPassword
  });

  // create the session token and OTP for email verification
  const [sessionToken, otp] = await Promise.all([
    createSessionToken(newUser._id, "emailVerification"),
    createOtp(newUser._id, "emailVerification"),
  ]);

  // No await for advance response
  sendVerificationCodeViaEmail(newUser.email, "Email Verification", otp);

  return {
    message: "Account has successfully created. PIN for verification has been sent via Email.",
    user: newUser.toPublicJSON(),
    sessionToken
  };
}

export const verifyUserEmail = async (userId, pin) => {
  // verify the pin
  await verifyOtp(userId, pin, "emailVerification");

  // Verify the user
  user.isEmailVerified = true;
  await user.save();

  // Delete the session token and OTP to invalidate the email verification session.
  await Promise.all([
    otp.deleteOne(),
    SessionToken.deleteMany({ userId, type: "emailVerification"})
  ]);

  return {
    message : "Your Email is now verified.", 
    user : user.toPublicJSON()
  };
}

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");; 

  if(!user){
    throw new GenericError(400, "Email or password is incorrect", ERROR_CODES.INVALID_CREDENTIALS);
  }
  
  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid){
    throw new GenericError(400, "Email or password is incorrect", ERROR_CODES.INVALID_CREDENTIALS);
  }

  const tokens = generateTokens(user);

  return {
    message : "Login successful.",
    user : user.toPublicJSON(),
    accessToken : tokens.accessToken,
    refreshToken : tokens.refreshToken
  }
}

export const requestResetPassword = async (email) => {
  const user = await User.findOne({email});

  if(!user){
    throw new UserNotFound();
  }

  // create the session token and OTP for email verification
  const [sessionToken, otp] = await Promise.all([
    createSessionToken(user._id, "resetPasswordVerification"),
    createOtp(user._id, "resetPasswordVerification"),
  ]);

  // No await for advance response
  sendVerificationCodeViaEmail(email, "Reset Password Verification", otp);

  return {
    message: "PIN for verification has sent via email.",
    sessionToken
  };
}

export const verifyResetPassword = async (userId, pin) => {
  // verify the pin
  await verifyOtp(userId, pin, "resetPasswordVerification");

  // delete the old session token and OTP (type: resetPasswordVerification)
  await Promise.all([
    SessionToken.deleteMany({userId, type: "resetPasswordVerification"}),
    Otp.deleteMany({userId, type: "resetPasswordVerification"})
  ]);

  // Create a session token for resetting password
  const sessionToken = await createSessionToken(userId, "resetPassword");

  return {
    message: "Request for resetting password has been granted.",
    sessionToken
  }
} 

// --

const createSessionToken = async (userId, sessionType) => {
  const existingSessionToken = await SessionToken.findOne({ userId, type: sessionType, });

  if(existingSessionToken && existingSessionToken.isOnCooldown()){
    throw new GenericError(429, "Please wait for a few moments before requesting for new session.", ERROR_CODES.TOO_MANY_REQUEST);
  }

  if (existingSessionToken) {
    await SessionToken.deleteMany({ userId,type: sessionType });
  }

  const rawToken = generateCryptoToken();

  const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

  const newSessionToken = await SessionToken.create({
    userId: userId,
    token: hashedToken,
    type: sessionType,
  })

  return rawToken;
}

const createOtp = async (userId, otpType) => {
  const existingOtp = await Otp.findOne({ userId, type: otpType, });

  if(existingOtp && existingOtp.isOnCooldown()){
    throw new GenericError(429, "Please wait for a few moments before requesting for new OTP.", ERROR_CODES.TOO_MANY_REQUEST);
  }

  if (existingOtp) {
    await Otp.deleteMany({ userId,type: otpType });
  }

  const rawPin = generateSixDigitCode();

  const hashedPin = crypto
      .createHash('sha256')
      .update(rawPin)
      .digest('hex');

  const newOtp = await Otp.create({
    userId: userId,
    pin: hashedPin,
    type: otpType,
  })

  return rawPin;
}

export const verifyOtp = async ( userId, pin, otpType ) => {
  const user = await User.findById(userId);
  if(!user){
    throw new UserNotFound();
  }

  // Check for OTP if it exist
  const otp = await Otp.findOne({userId, type: otpType});
  if(!otp){
    throw new GenericError(400, "OTP has expired. Try again.", ERROR_CODES.EXPIRED);
  }

  // Check and Compare the input PIN from the one in the database
  if(!(otp.isValidPin(pin))) {
    await otp.incrementAttempt(); // record attempt

    const hasAttemptsRemaining =
            otp.attempts < MAX_OTP_ATTEMPTS;

    if(hasAttemptsRemaining){
      const remainingAttempts = MAX_OTP_ATTEMPTS - otp.attempts;
      throw new GenericError(400, `Pin is incorrect. You have ${remainingAttempts} attempts remaining.`, ERROR_CODES.INCORRECT_PIN);
    } else {
      throw new GenericError(400, "You have reached the maximum attempts. Please request a new PIN.", ERROR_CODES.INCORRECT_PIN);
    }
  }    
}