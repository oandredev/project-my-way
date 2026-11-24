import axios from "axios";

let authToken = null;
let unauthorizedHandler = null;

export function setAuthToken(token) {
  authToken = token;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function unwrap(body) {
  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    "data" in body
  ) {
    return body.data;
  }
  return body;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    response.data = unwrap(response.data);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    if (
      status === 401 &&
      !error.config?.skipUnauthorized &&
      unauthorizedHandler
    ) {
      await unauthorizedHandler();
    }
    return Promise.reject(error);
  },
);

export default api;
