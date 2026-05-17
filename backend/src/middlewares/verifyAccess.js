import { decodeAccessToken, getTokenFromHeaders } from "../utils/token.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";

const verifyAccess = (requiredRole = "user") => (
  async (req, res, next) => {
    // Extract the token from authorization
    const token = getTokenFromHeaders(req.headers);

    const decoded = await decodeAccessToken(token);

    const userRole = decoded.role;

    const isAdmin = userRole === "admin";
    if(isAdmin){
      req.user = decoded;
      next();
    }

    const hasRequiredRole = userRole === requiredRole;
    if (!hasRequiredRole) {
      return next(new UnauthorizeError("You don't have access to this route."));
    }

    console.log(userRole);

    req.user = decoded;
    next();
  }
)

export default verifyAccess;