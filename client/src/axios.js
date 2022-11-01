import axios from "axios"

export const authAxios = axios.create({
  baseURL: "http://localhost:5000/auth",
  withCredentials: true,
})
