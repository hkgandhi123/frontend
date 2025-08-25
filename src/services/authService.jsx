// src/services/authService.js
import axios from "axios";

// ✅ Backend ka URL (Render pe host hua)
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true,
});

// 🔹 Login request
export const login = async (formData) => {
  try {
    const res = await API.post("/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// 🔹 Register request
export const register = async (formData) => {
  try {
    const res = await API.post("/auth/register", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Register failed" };
  }
};

// 🔹 Get logged-in user info
export const getMe = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Fetch user failed" };
  }
};
