import { COOKIE_REFRESHTOKEN } from "../config/cookie.js";
import { loginUser, registerUser, verifyUserEmail } from "../services/auth.services.js"

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
      message: "Login successful.",
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