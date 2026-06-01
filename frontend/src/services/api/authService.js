import apiRequest from './index'; 

const authService = {
  login: async (credentials) => {
    const data = await apiRequest.post("/v1/auth/login", credentials);

    localStorage.setItem("accessToken", data.accessToken);

    return data;  
  },

  register: async (userData) => {
    return await apiRequest.post("/v1/auth/register", userData);
  },

  logout: async () => {
    await apiRequest.post("/v1/auth/logout");

    localStorage.removeItem("accessToken");

    return;
  },

  verifySessionToken: async (sessionToken) => {
    return await apiRequest.post("/v1/auth/verify/token?type=sessionToken", {}, {
      headers: {
        "Authorization" : `Bearer ${sessionToken}`,
      }
    })
  },

  verifyEmail: async (pin, sessionToken) => {
    const data = await apiRequest.post("/v1/auth/verify/email", { pin }, {
      headers: {
        "Authorization" : `Bearer ${sessionToken}`,
      }
    })

    localStorage.setItem("accessToken", data.accessToken);

    return data
  },

  resendEmailVerification: async (sessionToken) => {
    return await apiRequest.get("/v1/auth/verify/email/resend", {
      headers: {
        "Authorization" : `Bearer ${sessionToken}`,
      }
    })
  },

  setUpAccount: async (data) => {
    return await apiRequest.put("/v1/user/account/set-up", data)
  },

  getCurrentUser: async () => {
    return await apiRequest.get('/v1/user/me');
  }
};

export default authService;