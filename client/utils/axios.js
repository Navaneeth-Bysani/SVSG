import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.83.149:4000/api/v1",
  withCredentials: true,
});
