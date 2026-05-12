import GenericError from "../errors/GenericError.js";
import ERROR_CODES from "../config/errorCodes.js";

import User from "../models/user.model.js";
import SessionToken from "../models/sessionToken.model.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { generateCryptoToken } from "../utils/utils.js";

export const registerUser = async (userData) => {
  const { firstName, lastName, middleInitial, email, password} = userData;

  const existingUser = await User.findOne({email});
  
  // Check if the user already exist and is VERIFIED.
  if(existingUser && existingUser.isEmailVerified){
    throw new GenericError(400, "The email has already been registered.", ERROR_CODES.EMAIL_ALREADY_REGISTERED)
  }

  // If the user exist but are UNVERIFIED, delete the exisiting data
  if(existingUser && !existingUser.isEmailVerified){
    await existingUser.deleteOne();
    await SessionToken.deleteMany({ user: existingUser._id});
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

  // create the session token for email verification
  const sessionToken = await createSessionToken(newUser._id, "emailVerification");

  return {
    user: newUser.toPublicJSON(),
    sessionToken
  };
}

//

const createSessionToken = async (userId, sessionType) => {
  const existingSessionToken = await SessionToken.findOne({ 
    user: userId,
    type: sessionType, 
   });

  if(existingSessionToken && existingSessionToken.isOnCooldown()){
    throw new GenericError(429, "Please wait for a few moments before requesting a new session.", ERROR_CODES.TOO_MANY_REQUEST);
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

const generateToken = (user) => {
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