const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || '';

const apiRequest = {
  get: (route, options = {}) => request(route, { ...options, method: "GET" }),
  post: (route, body, options = {}) => request(route, { ...options, method: "POST", body }),
  put: (route, body, options = {}) => request(route, { ...options, method: "PUT", body }),
  patch: (route, body, options = {}) => request(route, { ...options, method: "PATCH", body }),
  delete: (route, options = {}) => request(route, { ...options, method: "DELETE" }),
}

const request = async (rawRoute, rawOptions = {}) => {
  const route = `${SERVER_BASE_URL}${rawRoute}`;
  const config = configureOptions(rawOptions);

  const response = await fetch(route, config);

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status code ${response.status}.`);
  }

  return data;
}

const configureOptions = ({ method = "GET", body, headers, ...restOptions }) => {
  const config = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...restOptions,
  };

  if (body) {
    config.body = typeof body === "object" ? JSON.stringify(body) : body;
  }

  return config;
}

export default apiRequest;