import { Router } from "express";
import joiValidator from "../../middlewares/joiValidator.js";

import { 
  handleRegister
 } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/register", handleRegister );

export default authRoute