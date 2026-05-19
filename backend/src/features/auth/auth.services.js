import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

import GenericError from "../../errors/GenericError.js";
import ERROR_CODES from "../../config/errorCodes.js";
import UserNotFound from "../../errors/UserNotFound.js";

import User from "../../models/user.model.js";
import SessionToken, { SESSION_TOKEN_TYPES } from "../../models/sessionToken.model.js";

import { generateCryptoToken, generateSixDigitCode } from "../../utils/utils.js";
import Otp, { MAX_OTP_ATTEMPTS, OTP_TYPES } from "../../models/otp.model.js";
import { sendVerificationCodeViaEmail } from "../../utils/mailer.js";
import { generateTokens } from "../../utils/token.js";
import InvalidCredentials from "../../errors/InvalidCredentials.js";
import TooManyRequest from "../../errors/TooManyRequest.js";

// --- services

export const registerUser = async (userData) => {
  const { firstName, lastName, middleInitial, username, email, password} = userData;
  const credentials = { username, email};

  const existingUser = await findConflictingUser(credentials);
  if (existingUser) await resolveConflict(existingUser, credentials);
  
  const hashedPassword = await User.hashPassword(password);
  const newUser = await createUserRecord({ firstName, lastName, middleInitial, username, email }, hashedPassword);

  const [sessionToken, otp] = await issueVerificationTokens(newUser._id, SESSION_TOKEN_TYPES.EMAIL_VERIFICATION);

  sendVerificationCodeViaEmail(newUser.email, "Email Verification", otp); // No await for advance response
 
  return {
    message: "Account has been successfully created. PIN for verification has been sent via Email.",
    user: newUser.toPublicJSON(),
    sessionToken
  };
}

export const verifyUserEmail = async (userId, pin) => {
  const user = await findUserById(userId);

  await verifyOtp(userId, pin, OTP_TYPES.EMAIL_VERIFICATION);

  // Verify the user
  user.isEmailVerified = true;
  await user.save();

  await invalidateSessionAndOtp(userId, SESSION_TOKEN_TYPES.EMAIL_VERIFICATION);

  return {
    message : "Your email is now verified.", 
    user : user.toPublicJSON()
  };
}

export const loginUser = async (userData) => {
  const { identifier, password } = userData;

  const user = await findUserByIdentifier(identifier).select("+password");

  if(!user) throw new InvalidCredentials("Email, Username, or password is incorrect");

  if(!user.isEmailVerified) throw new InvalidCredentials("Your account is not verified. Please check your email for the verification pin.");

  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid) throw new InvalidCredentials("Email, Username, or password is incorrect");

  const tokens = generateTokens(user);

  return {
    message : "Login successful.",
    user : user.toPublicJSON(),
    accessToken : tokens.accessToken,
    refreshToken : tokens.refreshToken
  }
}

export const requestResetPassword = async (identifier) => {
  const user = await findUserByIdentifier(identifier);

  if (!user) throw new UserNotFound();

  if (!user.isEmailVerified) throw new InvalidCredentials("Your account is not verified. Please check your email for the verification pin.");

  const [sessionToken, otp] = await issueVerificationTokens(user._id, SESSION_TOKEN_TYPES.RESET_PASS_VERIFICATION);

  sendVerificationCodeViaEmail(user.email, "Reset Password Verification", otp); // No await for advance response

  return {
    message: "PIN for verification has sent via email.",
    sessionToken
  };
}

export const verifyResetPassword = async (userId, pin) => {
  await verifyOtp(userId, pin, OTP_TYPES.RESET_PASS_VERIFICATION);

  await invalidateSessionAndOtp(userId, SESSION_TOKEN_TYPES.RESET_PASS_VERIFICATION);

  const sessionToken = await createSessionToken(userId, SESSION_TOKEN_TYPES.RESET_PASS);

  return {
    message: "Request for resetting password has been granted.",
    sessionToken
  }
} 

export const resetUserPassword = async (userId, newPassword) => {
  const user = await User.findById(userId).select("+password");

  // change user password
  const hashedPassword = await User.hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  // delete the sessionToken for resetting the password
  await SessionToken.deleteMany({userId, type: SESSION_TOKEN_TYPES.RESET_PASS})

  return {
    message: "Password has successfully changed."
  }  
}



// --- Helpers

const findUserByIdentifier = (identifier) =>
  User.findOne({ $or: [{ username : identifier }, { email : identifier }] });

const findConflictingUser = ({ username, email }) =>
  User.findOne({ $or: [{ username }, { email }] });


const throwIfVerifiedConflict = (existingUser, { username, email }) => {
  if (existingUser.email === email) {
    throw new GenericError(400, "The email has already been registered.", ERROR_CODES.EMAIL_ALREADY_REGISTERED);
  }
  if (existingUser.username === username) {
    throw new GenericError(400, "The username has already been taken.", ERROR_CODES.USERNAME_ALREADY_TAKEN);
  }
};

const handleUnverifiedConflict = async (existingUser, { username, email }) => {
  const isSamePerson = existingUser.email === email;
  const isDifferentPerson = existingUser.username === username;

  if (isSamePerson) {
    // Re-registration attempt — wipe stale unverified records so they can start fresh
    await Promise.all([
      existingUser.deleteOne(),
      SessionToken.deleteMany({ userId: existingUser._id }),
      Otp.deleteMany({ userId: existingUser._id }),
    ]);
  } else if (isDifferentPerson) {
    // Someone else trying to claim an unverified username, block them
    throw new GenericError(400, "The username has already been taken.", ERROR_CODES.USERNAME_ALREADY_TAKEN);
  }
}

const resolveConflict = async (existingUser, { username, email }) => {
  if (existingUser.isEmailVerified){
    throwIfVerifiedConflict(existingUser, { username, email });
  } else {
    await handleUnverifiedConflict(existingUser, { username, email })
  }
}

const issueVerificationTokens = (userId, verificationType) =>
  Promise.all([
    createSessionToken(userId, verificationType),
    createOtp(userId, verificationType),
  ]);

const createUserRecord = (userData, hashedPassword) =>
  User.create({ ...userData, password: hashedPassword });  

export const findUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new UserNotFound();

  return user;
}

const findUserByEmail = async (email) => {
  const user = await User.findOne({email});

  if (!user) throw new UserNotFound();

  return user;
}

const invalidateSessionAndOtp = (userId, sessionType) =>
  Promise.all([
    Otp.deleteMany({ userId, type: sessionType}),
    SessionToken.deleteMany({ userId, type: sessionType})
  ]);

const createSessionToken = async (userId, sessionType) => {
  const existingSessionToken = await SessionToken.findOne({ userId, type: sessionType, });

  if(existingSessionToken && existingSessionToken.isOnCooldown()) 
    throw new TooManyRequest("Please wait for a few moments before requesting for new session.");

  if (existingSessionToken) await SessionToken.deleteMany({ userId,type: sessionType });

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

  if(existingOtp && existingOtp.isOnCooldown()) 
    throw new TooManyRequest("Please wait for a few moments before requesting for new OTP.");

  if (existingOtp) await Otp.deleteMany({ userId,type: otpType });


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
  // Check for OTP if it exist
  const otp = await Otp.findOne({userId, type: otpType});
  if(!otp) throw new GenericError(400, "OTP has expired. Try again.", ERROR_CODES.EXPIRED);

  // Check and Compare the input PIN from the one in the database
  if(!(otp.isValidPin(pin))) {
    await otp.incrementAttempt().save(); // increament the attempt

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