import { COOKIE_REFRESHTOKEN } from "../../config/cookie.js";
import GenericError from "../../errors/GenericError.js";
import UserNotFound from "../../errors/UserNotFound.js";
import User from "../../models/user.model.js";

import { generateTokens, getTokenFromHeaders } from "../../utils/token.js";
import ERROR_CODES from "../../config/errorCodes.js";
import { verifyToken } from "../../utils/token.js";

import { 
  loginUser, 
  registerUser, 
  requestResetPassword, 
  resetUserPassword, 
  verifyResetPassword, 
  verifyUserEmail 
} from "./auth.services.js"

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
  const token = getTokenFromHeaders(req.headers);

  const tokenType = req.query.type || "accessToken";

  await verifyToken(token, tokenType);

  res.status(200)
    .json({
      success: true, 
      message: "Token is valid.",
      data: {
        token,
        tokenType
      }
    })
}


export const handleRequestResetPassword = async (req, res) => {
  const result = await requestResetPassword(req.body.identifier);

  return res.status(200)  
    .json({
      success: true,
      message: result.message,
      sessionToken: result.sessionToken
    })
}

export const handleResetPasswordVerification = async (req, res) => {
  const result = await verifyResetPassword(req.user._id, req.body.pin);

  return res.status(200)
    .json({
      success: true,
      message: result.message,
      sessionToken: result.sessionToken
    })
}

export const handleResetPassword = async (req, res) => {
  const result = await resetUserPassword(req.user._id, req.body.newPassword);

  return res.status(200)
    .json({
      success: true,
      message: result.message,
    })
} 