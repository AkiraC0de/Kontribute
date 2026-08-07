import { decodeAccessToken, getTokenFromHeaders } from "../utils/token.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";

const verifyAuth = async (req, res, next) => {
  // Extract the token from authorization
  const token = getTokenFromHeaders(req.headers);

  const decoded = await decodeAccessToken(token);

  req.user = decoded;
  next();
}

export default verifyAuth;