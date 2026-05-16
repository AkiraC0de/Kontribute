import { Router } from "express";
import joiValidator from "../middlewares/joiValidator.js";
import verifySessionToken from "../middlewares/verifySessionToken.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.js";

import { sixDigitPinVerificationSchema, 
  loginSchema, 
  registerSchema, 
  requestResetPasswordSchema 
} from "../validations/auth.validations.js"

import { 
  handleEmailVerification,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
  handleRequestResetPassword,
  handleResetPasswordVerification,
  handleVerifyToken
} from "../controllers/auth.controller.js";


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

// Process email verification OTP to recieve SessionToken (type: resetPassword). 
// Requires SessionToken (type: emailVerification)
authRoute.post("/verify/email", 
  verifySessionToken("emailVerification"),  
  joiValidator(sixDigitPinVerificationSchema, "body"), 
  handleEmailVerification 
);

// Verify the emailed OTP. Requires SessionToken (type: resetPasswordVerification)
authRoute.post("/verify/reset-password", 
  verifySessionToken("resetPasswordVerification"), 
  joiValidator(sixDigitPinVerificationSchema, "body"),
  handleResetPasswordVerification
);
// -- Password reset 

// Recieve an OTP via email and SessionToken (type: requestResetPassword). Requires users in email.
authRoute.post("/password/request-reset", joiValidator(requestResetPasswordSchema, "body"), handleRequestResetPassword);

// authRoute.post("/password/reset");



//  

export default authRoute