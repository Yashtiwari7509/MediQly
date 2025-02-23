import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Function to store token securely (You can modify this as needed)
const setToken = (token: string) => {
  localStorage.setItem("token", token); // Prefer HTTP-only cookies if possible
};

// Function to get stored token
export const getToken = () => {
  return localStorage.getItem("token"); // Used in API requests
};

// Register User & Store Token
const registerUser = async (userData) => {
  const { data } = await axios.post(
    "http://localhost:8000/users/register",
    userData
  );
  setToken(data.token); // Store token
  return data; // Return user data
};

// Login User & Store Token
const loginUser = async (credentials) => {
  const { data } = await axios.post(
    "http://localhost:8000/users/login",
    credentials
  );
  setToken(data.token); // Store token
  return data; // Return user data
};

// Custom Hooks
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user); // Store user globally
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user); 
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await Promise.resolve(); // Mimic async behavior
      localStorage.removeItem("token");
      queryClient.setQueryData(["currentUser"], null);
    },
  });
};

