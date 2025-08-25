// src/services/authService.js
import API from "../api";

export const login = async (formData) => {
  const { data } = await API.post("/auth/login", formData);
  if (data.token) localStorage.setItem("token", data.token);
  return data;
};

export const register = async (formData) => {
  const { data } = await API.post("/auth/register", formData);
  return data;
};
