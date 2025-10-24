// src/config/api.ts
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend
  withCredentials: true,            // send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
