import React, { useState } from "react";
import axios from "axios";
import "./RegistroUsuario.css"; // Importamos la hoja de estilos

const RegistroUsuario = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
    <div className="registro-usuario">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            name="name"
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
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Rol</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      {message && (
        <div
          className={`alert ${message.type === "success" ? "success" : "error"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default RegistroUsuario;
