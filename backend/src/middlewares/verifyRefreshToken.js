import { COOKIE_REFRESHTOKEN } from "../config/cookie.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (req, res, next) => {
  // Extract the token from cookies
  const refreshToken = req?.cookies[COOKIE_REFRESHTOKEN.NAME];

  if(!refreshToken) {
    throw new UnauthorizeError("Invalid or Expired Token.");
  }

  const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, ( err, decoded )=> {
    if(err){
      throw new UnauthorizeError("Invalid or Expired Token.");
    }

    return decoded
  });

  req.user = decoded;
  next();
}

export default verifyRefreshToken