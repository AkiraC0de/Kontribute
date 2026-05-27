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

  /**
   * Logs out the current user by clearing refresh token cookies.
   * Note: Since apiRequest uses credentials: "include", cookies are handled automatically.
   */
  logout: async () => {
    return await apiRequest.post("/v1/auth/logout");
  },

  /**
   * Fetches the currently authenticated user based on existing cookies/sessions.
   */
  getCurrentUser: async () => {
    return await apiRequest.get('/auth/me');
  }
};

export default authService;