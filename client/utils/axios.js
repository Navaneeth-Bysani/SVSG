import axios from "axios";

export default axios.create({
  // baseURL: "http://192.168.1.7:3000/api/v1",
  baseURL: "https://svsg-backend-main.onrender.com/api/v1",
  // baseURL: "https://svsg-392518.el.r.appspot.com/api/v1",
  withCredentials: true,
});
