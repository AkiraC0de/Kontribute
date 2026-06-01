import ERROR_CODES from "../../config/errorCodes.js";
import GenericError from "../../errors/GenericError.js";
import User from "../../models/user.model.js";
import { findActiveUserById, updateUser } from "./user.services.js";

export const handleMe = async (req, res) => {
  const user = await findActiveUserById(req.user._id);

  if(!user.isSetUpDone)
    throw GenericError(403, "Please proceed to setting up your account.", ERROR_CODES.ACCOUNT_REQUIRES_SET_UP);

  return res.status(200)
    .json({
      success: true,
      message: "Login success.",
      user: user.toPublicJSON()
    })
}

export const handleAccountSetUp = async (req, res) => {
  const user = await findActiveUserById(req.user._id);

  if(user.isSetUpDone)
    throw new GenericError(403, "Your account has already been set up.", ERROR_CODES.REQUEST_ERROR);

  const conflictingUsername = await User.findOne({username: req.body.username});
  if(conflictingUsername)
    throw new GenericError(400, "Username has already been taken. Please enter a new one.", ERROR_CODES.REQUEST_ERROR);

  const setupData = {
    ...req.body,
    middleInitial: req.body?.middleInitial || null, 
    isSetUpDone: true
  };

  await updateUser(user, setupData).save()

  return res.status(200).json({
    success: true,
    message: "Account setup completed successfully.",
    user: user.toPublicJSON()
  });
}