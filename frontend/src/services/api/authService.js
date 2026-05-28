import apiRequest from './index'; 

const authService = {
  login: async (credentials) => {
    const data = await apiRequest.post("/v1/auth/login", credentials);

    localStorage.setItem("accessToken", data.accessToken);

    return data.user;  
  },

  register: async (userData) => {
    const data = await apiRequest.post("/v1/auth/register", userData);
    return data.user;
  },

  /**
   * Logs out the current user by clearing refresh token cookies.
   * Note: Since apiRequest uses credentials: "include", cookies are handled automatically.
   */
  logout: async () => {
    await apiRequest.post("/v1/auth/logout");

    localStorage.removeItem("accessToken");

    return;
  },

  /**
   * Fetches the currently authenticated user based on existing cookies/sessions.
   */
  getCurrentUser: async () => {
    return await apiRequest.get('/auth/me');
  }
};

export default authService;