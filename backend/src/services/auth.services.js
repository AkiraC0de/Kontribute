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
      await existingUser.deleteOne(),
      await SessionToken.deleteMany({ user: existingUser._id}),
      await Otp.deleteMany({ user: existingUser._id})
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
    await createSessionToken(newUser._id, "emailVerification"),
    await createOtp(newUser._id, "emailVerification"),
  ]);

  await sendVerificationCodeViaEmail(newUser.email, "Email Verification", otp);

  return {
    user: newUser.toPublicJSON(),
    sessionToken
  };
}

export const verifyUserEmail = async (userId, pin) => {
  const user = await User.findById(userId);
  if(!user){
    throw GenericError(404, "User not found.", ERROR_CODES.NOT_FOUND);
  }

  // Check for OTP if it exist
  const otp = await Otp.findOne({user: userId, type: "emailVerification"});
  if(!otp){
    throw GenericError(400, "OTP has expired. Try again.", ERROR_CODES.EXPIRED);
  }

  // Check and Compare the input PIN from the one in the database
  if(!(otp.comparePin(pin))) {
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

  // Verify the user
  user.isEmailVerified = true;
  await user.save();

  // Delete the session token and OTP to invalidate the email verification session.
  await Promise.all([
    otp.deleteOne(),
    SessionToken.deleteMany({ user: userId, type: "emailVerification"})
  ]);

  return {
    user: user.toPublicJSON()
  };
}

//

const createSessionToken = async (userId, sessionType) => {
  const existingSessionToken = await SessionToken.findOne({ user: userId, type: sessionType, });

  if(existingSessionToken && existingSessionToken.isOnCooldown()){
    throw new GenericError(429, "Please wait for a few moments before requesting for new session.", ERROR_CODES.TOO_MANY_REQUEST);
  }

  if (existingSessionToken) {
    await SessionToken.deleteMany({ user: userId,type: sessionType });
  }

  const rawToken = generateCryptoToken();

  const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

  const newSessionToken = await SessionToken.create({
    user: userId,
    token: hashedToken,
    type: sessionType,
  })

  return rawToken;
}

const createOtp = async (userId, otpType) => {
  const existingOtp = await Otp.findOne({ user: userId, type: otpType, });

  if(existingOtp && existingOtp.isOnCooldown()){
    throw new GenericError(429, "Please wait for a few moments before requesting for new OTP.", ERROR_CODES.TOO_MANY_REQUEST);
  }

  if (existingOtp) {
    await Otp.deleteMany({ user: userId,type: otpType });
  }

  const rawPin = generateSixDigitCode();

  const hashedPin = crypto
      .createHash('sha256')
      .update(rawPin)
      .digest('hex');

  const newOtp = await Otp.create({
    user: userId,
    pin: hashedPin,
    type: otpType,
  })

  return rawPin;
}

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: "15m" } 
  );

  const refreshToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};