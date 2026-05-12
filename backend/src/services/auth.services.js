import GenericError from "../../errors/GenericError.js";
import ERROR_CODES from "../../config/errorCodes.js";
import User from "../models/user.model.js";

export const registerUser = async (userData) => {
  const { firstName, lastName, middleInitial, email, password} = userData;

  // Check is the user already exist.
  const userExist = await User.findOne({email, isEmailVerified: true});
  if(userExist){
    throw GenericError(400, "The email has already been registered.", ERROR_CODES.EMAIL_ALREADY_REGISTERED)
  }

}