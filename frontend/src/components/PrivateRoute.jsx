import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si hay token, mostramos la página protegida
  // Si no, mandamos al login ("/") y usamos replace para que no se pueda volver atrás
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
