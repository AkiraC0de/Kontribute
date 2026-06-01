import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import UserNotFound from "../../errors/UserNotFound.js";
import User from "../../models/user.model.js"

export const findActiveUserById = (userId) => {
  const user = User.findById(userId);

  if(!user) 
    throw new UserNotFound();

  if(user.isBlocked) 
    throw new GenericError(403, "You account has been blocked. Please contact us.", ERROR_CODES.ACCOUNT_BLOCKED);

  return user;
}

export const updateUser = (user, newUserData) => {
  Object.keys(newUserData).forEach(field => {
    user[field] = newUserData[field]
  })

  return user
}