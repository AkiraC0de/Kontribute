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
import { SESSION_TOKEN_TYPES } from "../../models/sessionToken.model.js";


const authRoute = Router();

// -- Core Authentication

// POST /api/v1/auth/register - Register a new account
authRoute.post("/register", joiValidator(registerSchema), handleRegister );

// POST /api/v1/auth/login - Authenticate user & issue tokens (Access/Refresh pairs)
authRoute.post("/login", joiValidator(loginSchema), handleLogin);

// POST /api/v1/auth/logout - Clear cookies / revoke sessions 
authRoute.post("/logout", handleLogout);

// POST /api/v1/auth/refresh - Exchange an old refresh token for a new pair 
authRoute.post("/refresh", verifyRefreshToken, handleRefresh);

// -- Token and Account Verification

// POST /api/v1/auth/verify/token - Verify active token state safely via headers/cookies
authRoute.post("/verify/token", handleVerifyToken);

// POST /api/v1/auth/verify/email - Process email verification OTP to receive SessionToken (type: resetPassword). Requires SessionToken (type: emailVerification)
authRoute.post("/verify/email", 
  verifySessionToken(SESSION_TOKEN_TYPES.EMAIL_VERIFICATION),  
  joiValidator(sixDigitPinVerificationSchema), 
  handleEmailVerification 
);

// POST /api/v1/auth/verify/reset-password - Verify the emailed OTP. Requires SessionToken (type: resetPasswordVerification)
authRoute.post("/verify/reset-password", 
  verifySessionToken(SESSION_TOKEN_TYPES.RESET_PASS_VERIFICATION), 
  joiValidator(sixDigitPinVerificationSchema),
  handleResetPasswordVerification
);

// -- Password reset 

// POST /api/v1/auth/password/request-reset - Receive an OTP via email and SessionToken (type: requestResetPassword). Requires users in email.
authRoute.post("/password/request-reset", joiValidator(requestResetPasswordSchema), handleRequestResetPassword);

// PATCH /api/v1/auth/password/reset - Reset user password. Requires SessionToken (type: resetPassword)
authRoute.patch("/password/reset", 
  verifySessionToken(SESSION_TOKEN_TYPES.RESET_PASS),
  joiValidator(resetPasswordSchema),
  handleResetPassword
);

export default authRoute