import ERROR_CODES from "../config/errorCodes.js";
import UnauthorizeError from "../errors/UnauthorizeError.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import SessionToken from "../models/sessionToken.model.js";

export const generateTokens = (userData) => {
  const accessToken = jwt.sign(
    { _id: userData._id, role: userData.role },
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: "15m" } 
  );

  const refreshToken = jwt.sign(
    { _id: userData._id, role: userData.role },
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: "15d" }
  );

  return { accessToken, refreshToken };
};

export const decodeRefreshToken = async (refreshToken) => {
  const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, ( err, decoded )=> {
    if(err){
      throw new UnauthorizeError("Invalid or Expired Token.");
    }
    return decoded;
  });

  return decoded;
}

export const decodeAccessToken = async (accessToken) => {
  const decoded = await jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, ( err, decoded )=> {
    if(err){
      throw new UnauthorizeError("Invalid or Expired Token.");
    }
    return decoded;
  });

  return decoded;
}

export const validateSessionToken = async (sessionToken, sessionType = null) => {
  const hashedToken = crypto
                          .createHash('sha256')
                          .update(sessionToken)
                          .digest('hex');

  const query = { token: hashedToken };

  if (sessionType !== null) {
    query.type = sessionType;
  }                          

  const validSessionToken = await SessionToken
                        .findOne(query)
                        .populate("userId");
  
  if(!validSessionToken){
    throw new UnauthorizeError("Invalid or Expired Session Token.");
  }

  return validSessionToken;                      
}

export const verifyToken = async (token, type) => {
  switch(type){
    case "accessToken" :
      return await decodeAccessToken(token);
      break;  
    case "sessionToken" :
      return await validateSessionToken(token);
      break;    
    default:
      throw new UnauthorizeError("Invalid token type.");
      break;  
  }
}