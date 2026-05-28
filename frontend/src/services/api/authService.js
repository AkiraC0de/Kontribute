import apiRequest from './index'; 

const authService = {
  login: async (credentials) => {
    const data = await apiRequest.post("/v1/auth/login", credentials);

    localStorage.setItem("accessToken", data.accessToken);

    return data.user;  
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

  getCurrentUser: async () => {
    return await apiRequest.get('/auth/me');
  }
};

export default authService;