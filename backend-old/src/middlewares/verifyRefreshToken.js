import { COOKIE_REFRESHTOKEN } from "../config/cookie.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import jwt from "jsonwebtoken";
import { decodeRefreshToken } from "../utils/token.js";

const verifyRefreshToken = async (req, res, next) => {
  // Extract the token from cookies
  const refreshToken = req?.cookies[COOKIE_REFRESHTOKEN.NAME];

  if(!refreshToken) {
    throw new UnauthorizeError("Invalid or Expired Token.");
  }

  const decoded = await decodeRefreshToken(refreshToken);

  req.user = decoded;
  next();
}

export default verifyRefreshToken