import SessionToken from "../models/sessionToken.model.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import crypto from "crypto";
import { validateSessionToken, getTokenFromHeaders } from "../utils/token.js";

const verifySessionToken = (sessionType) => {
  return async (req, res, next) => {
    // Extract the token from authorization
    const token = getTokenFromHeaders(req.headers)

    // validate the token if it does exist in the databsae
    const sessionToken = await validateSessionToken(token, sessionType);

    req.user = { _id: sessionToken.userId._id, role: sessionToken.userId.role };
    next();
  }
}

export default verifySessionToken;