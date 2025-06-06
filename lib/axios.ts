import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/ds",
});

API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token};`
  }
  return config;
});

export default API;