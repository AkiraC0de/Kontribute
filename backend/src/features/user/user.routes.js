import { Router } from "express";
import joiValidator from "../../middlewares/joiValidator.js";
import { handleMe, handleAccountSetUp } from "./user.controllers.js";
import verifyAuth from "../../middlewares/verifyAuth.js";
import { accountSetUpSchema } from "./user.validations.js";

const userRoute = Router();

// GET /api/v1/user/me - Fetch users data
userRoute.get("/me", verifyAuth, handleMe);

// GET /api/v1/user/account/set-up - Set up users account after registration
userRoute.post(
  "/account/set-up",
  verifyAuth,
  joiValidator(accountSetUpSchema),
  handleAccountSetUp,
);

export default userRoute;
