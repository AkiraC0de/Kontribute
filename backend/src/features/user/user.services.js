import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import UserNotFound from "../../errors/UserNotFound.js";
import User from "../../models/user.model.js"

export const findActiveUserById = (userId) => {
  const user = User.findById(userId);

  if(!user) 
    throw new UserNotFound();

  if(user.isBlocked) 
    throw new GenericError(403, "You account has been blocked. Please contact us.", ERROR_CODES.REQUEST_ERROR);

  return user;
}