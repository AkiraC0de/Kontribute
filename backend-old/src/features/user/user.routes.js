import { Router } from "express";
import joiValidator from "../../middlewares/joiValidator.js";
import { handleMe, handleAccountSetUp } from "./user.controllers.js";
import verifyAuth from "../../middlewares/verifyAuth.js";
import verifySessionToken from "../../middlewares/verifySessionToken.js"
import { accountSetUpSchema } from "./user.validations.js";
import { SESSION_TOKEN_TYPES } from "../../models/sessionToken.model.js";

const userRoute = Router();

// GET /api/v1/user/me - Fetch users data
userRoute.get("/me", verifyAuth, handleMe);

// PUT /api/v1/user/account/set-up - Set up users account after registration
userRoute.put(
  "/account/set-up",
  verifySessionToken(SESSION_TOKEN_TYPES.ACCOUNT_SET_UP),
  joiValidator(accountSetUpSchema),
  handleAccountSetUp,
);

export default userRoute;
