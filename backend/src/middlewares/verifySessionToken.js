import SessionToken from "../models/sessionToken.model.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import crypto from "crypto";

const verifySessionToken = (sessionType) => {
  return async (req, res, next) => {
    const auhtorization = req.header.auhtorization;

    const authorization = req.headers.authorization || req.headers.Authorization;
    if(!authorization) {
      throw new UnauthorizeError("Authorization in request headers is required.");
    }
    
    if(!authorization.startsWith("Bearer ")) {
      throw new UnauthorizeError("Invalid Authorization format. Valid : Bearer <token>");
    }
    // Extract the token from authorization
    const token = authorization.split(' ')[1];

    const hashedToken = crypto
                          .createHash('sha256')
                          .update(token)
                          .digest('hex');

    const sessionToken = await SessionToken
                          .findOne({ token: hashedToken, type: sessionType })
                          .populate("userId");
    
    if(!sessionToken){
      throw new UnauthorizeError("Invalid or Expired Session Token.");
    }

    req.user = sessionToken.userId;
    next();
  }
}

export default verifySessionToken;