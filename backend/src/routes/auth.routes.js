import { Router } from "express";
import joiValidator from "../middlewares/joiValidator.js";
import { emailVerificationSchema, loginSchema, registerSchema } from "../validations/auth.validations.js"

import { 
  handleEmailVerification,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
  handleVerifyToken
} from "../controllers/auth.controller.js";
import verifySessionToken from "../middlewares/verifySessionToken.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.js";

const authRoute = Router();

// -- Core Authentication

// Register a new account
authRoute.post("/register", joiValidator(registerSchema, "body"), handleRegister );

// Authenticate user & issue tokens (Access/Refresh pairs)
authRoute.post("/login", joiValidator(loginSchema, "body"), handleLogin);

// Clear cookies / revoke sessions 
authRoute.post("/logout", handleLogout);

// Exchange an old refresh token for a new pair 
authRoute.post("/refresh", verifyRefreshToken, handleRefresh);


// -- Token and Account Verification

// Verify active token state safely via headers/cookies
authRoute.post("/verify/token", handleVerifyToken);

// Process email verification OTP. Requires SessionToken (type: emailVerification)
authRoute.post("/verify/email", 
  verifySessionToken("emailVerification"),  
  joiValidator(emailVerificationSchema, "body"), 
  handleEmailVerification 
);

// Verify the emailed OTP. Requires SessionToken (type: resetPasswordVerification)
// authRoute.post("/verify/reset-password") //NOT FINISH

//  

export default authRoute