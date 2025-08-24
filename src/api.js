// src/api.js
import axios from "axios";

// Backend API URL (Render se jo URL milega wo yaha dalna)
const API = axios.create({
  baseURL: "https://bkc-dt1n.onrender.com/", 
});

// Token automatic headers me bhejne ke liye interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
