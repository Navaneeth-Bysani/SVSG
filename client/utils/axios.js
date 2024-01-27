import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.1.9:3000/api/v1",
  baseURL: "https://svsg-backend-main.onrender.com/api/v1",
  withCredentials: true,
});
