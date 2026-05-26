const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || '';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const configureOptions = ({ method = "GET", body, headers, ...restOptions }) => {
  const config = {
    method,
    credentials: "include",
    headers: { ...headers },
    ...restOptions,
  };

  // Prevent overriding Content-Type if uploading files (FormData handles its own boundaries)
  if (!(body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  if (body !== undefined && body !== null) {
    // Only stringify if it's a plain object or array, NOT a FormData binary
    config.body = (typeof body === "object" && !(body instanceof FormData))
      ? JSON.stringify(body)
      : body;
  }

  return config;
};

const request = async (rawRoute, rawOptions = {}) => {
  const route = `${SERVER_BASE_URL}/api${rawRoute}`;
  const config = configureOptions(rawOptions);

  const response = await fetch(route, config);

  // Safely extract text first to avoid SyntaxErrors on empty JSON bodies (204/304 status responses)
  const responseText = await response.text();
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = (isJson && responseText) ? JSON.parse(responseText) : null;

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status code ${response.status}.`,
      response.status,
      data
    );
  }

  return data;
};

const apiRequest = {
  get: (route, options = {}) => request(route, { ...options, method: "GET" }),
  post: (route, body, options = {}) => request(route, { ...options, method: "POST", body }),
  put: (route, body, options = {}) => request(route, { ...options, method: "PUT", body }),
  patch: (route, body, options = {}) => request(route, { ...options, method: "PATCH", body }),
  delete: (route, options = {}) => request(route, { ...options, method: "DELETE" }),
};

export default apiRequest;