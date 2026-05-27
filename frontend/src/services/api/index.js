import { ValidationError, ApiError } from "./errorClasses";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || '';

const configureOptions = ({ method = "GET", body, headers, ...restOptions }) => {
  const accessToken = localStorage.getItem("accessToken");

  const config = {
    method,
    credentials: "include",
    headers: { 
      "Authorization" : `Bearer ${accessToken}`,
      ...headers 
    },
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

  const response = await fetch(route, config).catch((error) => {
    throw new Error("Network error or server is unreachable.");
  });

  const responseText = await response.text();
  const isJson = response.headers.get("content-type")?.includes("application/json");
  
  const data = (isJson && responseText) ? JSON.parse(responseText) : null;

  if (!response.ok || (data && !data.success)) {
    const message = data?.message || response.statusText || "An error occurred";
    const status = data?.status || response.status;
    const errorCode = data?.code || "UNKNOWN_ERROR";

    switch(data.code){
      case "VALIDATION_ERROR":
        throw new ValidationError(message, status, data.errors);
        break;
      default:
        throw new ApiError(message, status, errorCode, data);
        break;
    }
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