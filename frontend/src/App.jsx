import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Usuarios from "./pages/Usuarios";
import Membresias from "./pages/Membresias";
import EscaneoQR from "./pages/EscaneoQR";
import Dashboard from "./pages/Dashboard";
import RegistroUsuario from "./components/RegistroUsuario";
import EditarUsuario from "./pages/EditarUsuario";
import EditarMembresia from "./pages/EditarMembresia";
import Login from './components/Login.jsx';
import ResetPassword from './components/resetPassword.jsx';
import RegistroAccesos from "./components/RegistroAccesos.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/registro" element={<RegistroUsuario />} />
          <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
          <Route path="membresias" element={<Membresias />} />
          <Route path="membresias/editar/:id" element={<EditarMembresia />} />
          <Route path="scan" element={<EscaneoQR />} />
          <Route path="registro-accesos" element={<RegistroAccesos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;