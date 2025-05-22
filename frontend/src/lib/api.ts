import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin.replace(/:8080$/, ":3000");

console.log(
  "VITE mode:",
  import.meta.env.MODE,
  "VITE_API_BASE_URL:",
  import.meta.env.VITE_API_BASE_URL,
  "Resolved API_BASE_URL:",
  API_BASE_URL
);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
