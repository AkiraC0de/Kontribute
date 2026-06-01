import ERROR_CODES from "../../config/errorCodes";
import GenericError from "../../errors/GenericError";
import UserNotFound from "../../errors/UserNotFound";
import User from "../../models/user.model"

export const findActiveUserById = (userId) => {
  const user = User.findById(userId);

  if(!user) 
    throw new UserNotFound();

  if(user.isBlocked) 
    throw new GenericError(403, "You account has been blocked. Please contact us.", ERROR_CODES.REQUEST_ERROR);

  return user;
}