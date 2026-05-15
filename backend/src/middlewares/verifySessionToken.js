import SessionToken from "../models/sessionToken.model.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import crypto from "crypto";
import { validateSessionToken } from "../utils/token.js";

const verifySessionToken = (sessionType) => {
  return async (req, res, next) => {
    const authorization = req.headers.authorization || req.headers.Authorization;
    if(!authorization) {
      throw new UnauthorizeError("Authorization in request headers is required.");
    }
    
    if(!authorization.startsWith("Bearer ")) {
      throw new UnauthorizeError("Invalid Authorization format. Valid : Bearer <token>");
    }
    // Extract the token from authorization
    const token = authorization.split(' ')[1];

    // validate the token if it does exist in the databsae
    const sessionToken = await validateSessionToken(token, sessionType);

    req.user = sessionToken.userId; // populated user
    next();
  }
}

export default verifySessionToken;