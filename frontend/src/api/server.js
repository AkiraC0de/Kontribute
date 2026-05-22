const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const apiRequest = {
  async request(endpoint, options = {}) {
    const url = BASE_URL + endpoint;

    // Add this inside apiRequest.request right before: const response = await fetch(url, config);
console.log("CRITICAL CHECK - Absolute Fetch URL:", url);
    
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed with status " + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
};

export default apiRequest;