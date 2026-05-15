import { COOKIE_REFRESHTOKEN } from "../config/cookie.js";
import GenericError from "../errors/GenericError.js";
import UserNotFound from "../errors/UserNotFound.js";
import User from "../models/user.model.js";
import { loginUser, registerUser, requestResetPassword, verifyUserEmail } from "../services/auth.services.js"
import { generateTokens } from "../utils/token.js";
import ERROR_CODES from "../config/errorCodes.js";
import { verifyToken } from "../utils/token.js";

export const handleRegister = async (req, res) => {
  const result = await registerUser(req.body);

  return res.status(200)
    .json({
      success: true,
      message: result.message,
      user: result.user,
      sessionToken: result.sessionToken,
    });
}

export const handleEmailVerification = async (req, res) => {
  const result = await verifyUserEmail(req.user._id, req.body.pin);

  return res.status(200)
    .json({
      success : true,
      message: result.message,
      user: result.user
    });
}

export const handleLogin = async (req, res) => {
  const result = await loginUser(req.body);

  return res.status(200)
    .cookie(COOKIE_REFRESHTOKEN.NAME, result.refreshToken, COOKIE_REFRESHTOKEN.OPTIONS)
    .json({
      success: true,
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    });
}

export const handleLogout = async (req, res) => {
  res.clearCookie(COOKIE_REFRESHTOKEN.NAME);
  res.status(200).json({
      success: true, 
      message: "Logged out.",
  });
}

export const handleRefresh = async (req, res) => {
  const newTokens = generateTokens(req.user);
  const user = await User.findById(req.user._id);

  if(!user){
     throw new UserNotFound();
  }

  res.status(200)
    .cookie(COOKIE_REFRESHTOKEN.NAME, newTokens.refreshToken, COOKIE_REFRESHTOKEN.OPTIONS)
    .json({
        success: true, 
        message: "Refresh successful.",
        user: user.toPublicJSON(),
        accessToken: newTokens.accessToken
    });
}

export const handleVerifyToken = async (req, res) => {
  const token = req?.query?.token;
  if(!token) {
    throw new GenericError(400, "'token' is required in the request query.", ERROR_CODES.REQUEST_ERROR);
  }

  const tokenType = req?.query?.type;

  if(!tokenType) {
    throw new GenericError(400, "'type' is required in the request query.", ERROR_CODES.REQUEST_ERROR);
  }

  await verifyToken(token, tokenType);

  res.status(200)
    .json({
      success: true, 
      message: "Token is valid.",
      [tokenType]: token
    })
}


export const handleRequestResetPassword = async (req, res) => {
  const { email } = req.body;

  const result = await requestResetPassword(email);

  return res.status(200)  
    .json({
      success: true,
      message: result.message,
      sessionToken: result.sessionToken
    })
}