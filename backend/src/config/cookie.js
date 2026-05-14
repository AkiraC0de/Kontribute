
const COOKIE_REFRESHTOKEN_MAX_AGE = 15 * 24 * 60 * 60 * 1000, // 15 days

export const COOKIE_REFRESHTOKEN = {
  NAME: "KontributeGF",
  OPTIONS:{
    maxAge: COOKIE_MAX_AGE,
    path: "/",                       
    httpOnly: true,                  
    // secure: isProduction,            
    // sameSite: isProduction ? "strict" : "lax",
  }
}