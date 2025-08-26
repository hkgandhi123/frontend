// src/services/authService.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ✅ localhost मत लिखो
  withCredentials: true,
});

export const login = async (formData) => {
  try {
    const res = await API.post("/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};
