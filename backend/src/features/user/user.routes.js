import { Router } from "express";
import joiValidator from "../../middlewares/joiValidator.js";
import { handleMe, handleAccountSetUp } from "./user.controllers.js";
import verifyAuth from "../../middlewares/verifyAuth.js";
import { accountSetUpSchema } from "./user.validations.js";

const userRoute = Router();

// GET /api/v1/user/me - Fetch users data
userRoute.get("/me", verifyAuth, handleMe);

// PUT /api/v1/user/account/set-up - Set up users account after registration
userRoute.put(
  "/account/set-up",
  verifyAuth,
  joiValidator(accountSetUpSchema),
  handleAccountSetUp,
);

export default userRoute;
