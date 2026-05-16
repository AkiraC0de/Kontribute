**TASK

refactor the html on mailer.js => sendVerificationCodeViaEmail | pending

## Authentication API Reference

### Core Authentication

| Endpoint | Method | Middleware / Guards | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | `joiValidator(registerSchema)` | Registers a new user account, executes internal database conflict resolution for unverified stale entries, and sends a 6-digit verification PIN via email. |
| `/api/v1/auth/login` | `POST` | `joiValidator(loginSchema)` | Authenticates verified accounts, signs and drops an `HttpOnly` Refresh Token cookie, and returns a short-lived Access Token. |
| `/api/v1/auth/logout` | `POST` | *None* | Clears user session context by instantly destroying/invalidating the active `HttpOnly` Refresh Token cookie. |
| `/api/v1/auth/refresh` | `POST` | `verifyRefreshToken` | Consumes a valid long-lived refresh token to generate and rotate a new Access Token and Refresh Token pair. |

<br />

### Token & Account Verification

| Endpoint | Method | Middleware / Guards | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/verify/token` | `POST` | *None* (Query Validations) | Public utility route that checks `token` and `type` queries to quickly assert if a signature is still valid and unexpired. |
| `/api/v1/auth/verify/email` | `POST` | `verifySessionToken("emailVerification")`<br>`joiValidator(sixDigitPinVerificationSchema)` | Confirms the 6-digit verification PIN, flags the account as verified (`isEmailVerified: true`), and safely flushes temporary session schemas. |
| `/api/v1/auth/verify/reset-password` | `POST` | `verifySessionToken("resetPasswordVerification")`<br>`joiValidator(sixDigitPinVerificationSchema)` | Validates the recovery PIN entered by the user and upgrades their security clearance token state to allow direct password mutations. |

<br />

### Password Management Pipeline

| Endpoint | Method | Middleware / Guards | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/password/request-reset` | `POST` | `joiValidator(requestResetPasswordSchema)` | Confirms whether an email belongs to a verified user account, creates a rate-limited recovery context, and delivers an email PIN. |
| `/api/v1/auth/password/reset` | `POST` | `verifySessionToken("resetPassword")`<br>`joiValidator(resetPasswordSchema)` | Accepts a verified password mutation context payload, overwrites the target user's password securely using `bcrypt`, and flushes recovery tokens. |