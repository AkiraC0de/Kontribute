import { findActiveUserById } from "./user.services.js";

export const handleMe = async (req, res) => {
  const user = await findActiveUserById(req.user._id);

  return res.status(200)
    .json({
      success: true,
      message: "Login success.",
      user: user.toPublicJSON()
    })
}

export const handleAccountSetUp = async (req, res) => {
  const user = await findActiveUserById(req.user._id);
  
}