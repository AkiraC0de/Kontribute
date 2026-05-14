import { Router } from "express";
import joiValidator from "../middlewares/joiValidator.js";
import { emailVerificationSchema, loginSchema, registerSchema } from "../validations/auth.validations.js"

import { 
  handleEmailVerification,
  handleLogin,
  handleLogout,
  handleRegister
} from "../controllers/auth.controller.js";
import verifySessionToken from "../middlewares/verifySessionToken.js";

const authRoute = Router();

authRoute.post("/register", joiValidator(registerSchema, "body"), handleRegister );

authRoute.post("/verify-email", verifySessionToken("emailVerification"),  joiValidator(emailVerificationSchema, "body") , handleEmailVerification );

authRoute.post("/login", joiValidator(loginSchema, "body"), handleLogin);

authRoute.get("/logout", handleLogout);

export default authRoute