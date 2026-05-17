import { decodeAccessToken, getTokenFromHeaders } from "../utils/token";

const verifyAccess = (requriedRole = "user") => (
  (req, res, next) => {
    // Extract the token from authorization
    const token = getTokenFromHeaders(req.headers);

    const decoded = decodeAccessToken(token);

    if(decoded.role === userRole){

    }
  }
)