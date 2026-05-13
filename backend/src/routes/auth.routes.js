import { Router } from "express";
import joiValidator from "../middlewares/joiValidator.js";
import { emailVerificationSchema, registerSchema } from "../validations/auth.validations.js"

import { 
  handleEmailVerification,
  handleRegister
} from "../controllers/auth.controller.js";
import verifySessionToken from "../middlewares/verifySessionToken.js";

const authRoute = Router();

authRoute.post("/register", joiValidator(registerSchema, "body"), handleRegister );

authRoute.post("/verify-email", verifySessionToken("emailVerification"),  joiValidator(emailVerificationSchema, "body") , handleEmailVerification );

export default authRoute