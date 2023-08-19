import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.212.149:4000/api/v1",
  // baseURL: "https://sve-backend.onrender.com/api/v1",
  withCredentials: true,
});
