// frontend/src/components/RegistroUsuario.jsx
import React, { useState } from "react";
import axios from "axios";

const RegistroUsuario = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Limpia el Base64 para que no meta caracteres raros
  const sanitizeBase64 = (text) => {
    return text
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:5001/api/users", form);

      if (res.data.qr_code) {
        // Limpiar QR antes de mostrarlo o enviarlo
        const cleanedQR = sanitizeBase64(res.data.qr_code);
        console.log("QR limpio generado:", cleanedQR);
      }

      setMessage({ type: "success", text: res.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al registrar usuario."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {message && (
        <div
          className={`alert mt-3 alert-${
            message.type === "success" ? "success" : "danger"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default RegistroUsuario;
