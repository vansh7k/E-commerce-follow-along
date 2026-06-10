import axios from "axios";

const API = axios.create({
  baseURL: "https://e-commerce-follow-along-iurp.onrender.com/api",
  timeout: 10000,
});

// Attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("maverick_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
