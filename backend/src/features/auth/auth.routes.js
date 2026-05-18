import { Router } from "express";
import joiValidator from "../../middlewares/joiValidator.js";
import verifySessionToken from "../../middlewares/verifySessionToken.js";
import verifyRefreshToken from "../../middlewares/verifyRefreshToken.js";

import { sixDigitPinVerificationSchema, 
  loginSchema, 
  registerSchema, 
  requestResetPasswordSchema, 
  resetPasswordSchema
} from "./auth.validations.js"

import { 
  handleEmailVerification,
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
  handleRequestResetPassword,
  handleResetPassword,
  handleResetPasswordVerification,
  handleVerifyToken
} from "./auth.controller.js";


const authRoute = Router();

// -- Core Authentication

// Register a new account
authRoute.post("/register", joiValidator(registerSchema), handleRegister );

// Authenticate user & issue tokens (Access/Refresh pairs)
authRoute.post("/login", joiValidator(loginSchema), handleLogin);

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
  joiValidator(sixDigitPinVerificationSchema), 
  handleEmailVerification 
);

// Verify the emailed OTP. Requires SessionToken (type: resetPasswordVerification)
authRoute.post("/verify/reset-password", 
  verifySessionToken("resetPasswordVerification"), 
  joiValidator(sixDigitPinVerificationSchema),
  handleResetPasswordVerification
);
// -- Password reset 

// Recieve an OTP via email and SessionToken (type: requestResetPassword). Requires users in email.
authRoute.post("/password/request-reset", joiValidator(requestResetPasswordSchema, "body"), handleRequestResetPassword);

// Reset user password. Requires SessionToken (type: resetPassword)
authRoute.patch("/password/reset", 
  verifySessionToken("resetPassword"),
  joiValidator(resetPasswordSchema),
  handleResetPassword
);



//  

export default authRoute