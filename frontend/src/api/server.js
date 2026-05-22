import { setAccessToken, getAccessToken } from "../utils/token";

/**
 * @fileoverview API Client Utility with Automated JWT Token Rotation.
 * 
 * This utility wraps the native `fetch` API to handle standard HTTP requests 
 * (GET, POST, PUT, PATCH, DELETE) while managing authentication state seamlessly.
 * 
 * ### Key Features:
 * 1. **Lazy Refresh:** If an access token is missing from memory on an initial request, 
 *    it attempts to fetch a new one via the refresh endpoint before executing.
 * 2. **Automatic 401 Interception:** If a request fails with a 401 Unauthorized status, 
 *    it intercepts the failure, requests a new access token using HttpOnly cookies (`credentials: "include"`), 
 *    and transparently retries the original request.
 * 3. **Automatic Serialization:** Automatically stringifies request bodies if they are passed as objects.
*/

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const apiRequest = {
  async refreshToken() {
    try {
      const res = await fetch(BASE_URL + "/api/v1/auth/refresh", { 
        method: "POST", 
        credentials: "include"
      });
      const data = await res.json(); 

      if (!res.ok) 
        throw new Error(data.message || `Refresh Token failed! status: ${res.status}`);

      setAccessToken(data.accessToken);
      return data;
    } catch (error) {
      throw new Error(`Refresh token error: ${error.message || error}`);
    }
  },

  async request(route, options = {}) {
    const url = BASE_URL + route;
    let isRefreshed = false;
    try {
      let accessToken = getAccessToken();

      if (!accessToken) {
        isRefreshed = true;
        const refreshData = await this.refreshToken();
        accessToken = refreshData.accessToken; 
        setAccessToken(refreshData.accessToken);
      }

      const fetchOptions = { ...options };
      if (fetchOptions.body && typeof fetchOptions.body === "object") {
        fetchOptions.body = JSON.stringify(fetchOptions.body);
      }

      const makeRequest = (token) => {
        return fetch(url, { 
          ...fetchOptions, 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...fetchOptions.headers
          }
        });
      };

      let res = await makeRequest(accessToken);

      if(res.status == 401 && !isRefreshed){
        isRefreshed = true;
        const refreshData = await this.refreshToken();
        setAccessToken(refreshData.accessToken);

        res = await makeRequest(refreshData.accessToken); 
        return res.json();
      }

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || `Fetch failed! status: ${res.status}`);

      return data;
    } catch (error) {
      throw new Error(`Fetch error: ${error.message || error}`);
    }
  },

  get(route, options) {
    return this.request(route, { ...options, method: "GET" });
  },

  post(route, body, options) { 
    return this.request(route, { ...options, method: "POST", body });
  },

  patch(route, body, options) { 
    return this.request(route, { ...options, method: "PATCH", body });
  },

  put(route, body, options) { 
    return this.request(route, { ...options, method: "PUT", body });
  },

  delete(route, options) { 
    return this.request(route, { ...options, method: "DELETE" });
  }
};

export default apiRequest;