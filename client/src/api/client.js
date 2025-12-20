import axios from "axios";

// !.Use the Environment Variable
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// console.log("🔌 Connecting to Backend at:", baseURL); // Debug log to verify

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2. Attach Token Automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;