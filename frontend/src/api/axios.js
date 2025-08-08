import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/users", // backend
});

export default api;
