import { Router } from "express";
import joiValidator from "../middlewares/joiValidator.js";
import { registerSchema } from "../validations/auth.validations.js"

import { 
  handleRegister
 } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/register", joiValidator(registerSchema, "body"), handleRegister );

export default authRoute