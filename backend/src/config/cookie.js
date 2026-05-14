

export const COOKIE_REFRESHTOKEN = {
  NAME: "KontributeRF",
  OPTIONS:{
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    path: "/",                       
    httpOnly: true,                  
    // secure: isProduction,            
    // sameSite: isProduction ? "strict" : "lax",
  }
}