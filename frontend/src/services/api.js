import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Usuarios
export const getAllUsers = () => API.get("/users");
export const createUser = (data) => API.post("/users", data);

// Membresías
export const getMembershipsByClient = (id) => API.get(`/memberships/client/${id}`);
