import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.VITE_BACKEND_URL!}/api`,
  headers: { "Content-Type": "application/json" },
});

export default api;
