import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Usuarios.css'; // Importa los estilos nuevos

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/users');
      const allUsers = response.data.data;

      setUsuarios(allUsers.filter(user => user.role === 'user'));
      setAdmins(allUsers.filter(user => user.role === 'admin'));

      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
      setUsuarios([]);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const toggleUserActiveStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `http://localhost:5001/api/users/${userId}/deactivate`
        : `http://localhost:5001/api/users/${userId}/activate`;

      await axios.patch(endpoint);
      fetchUsuarios();
    } catch (err) {
      console.error(`Error al cambiar el estado del usuario ${userId}:`, err);
      setError(`No se pudo ${currentStatus ? 'desactivar' : 'activar'} el usuario.`);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando usuarias...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="usuarios-container">
      <h1>Gestión de Usuarias</h1>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/admin/usuarios/registro" className="btn-registrar">
          <i className="fas fa-user-plus"></i>
          Registrar Nueva Usuaria
        </Link>
      </div>

      {/* Tabla de Usuarios Regulares */}
      <div className="card mb-4">
        <div className="card-header">
          Lista de Usuarios (Miembros)
        </div>
        <div className="card-body">
          {usuarios.length === 0 ? (
            <p className="text-center">No hay usuarios (miembros) registrados.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.is_active ? (
                          <span className="badge-success">Activo</span>
                        ) : (
                          <span className="badge-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/usuarios/editar/${user.id}`)}
                          className="btn btn-info btn-sm mr-2"
                          title="Editar usuaria"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => toggleUserActiveStatus(user.id, user.is_active)}
                          className={`btn btn-${user.is_active ? 'warning' : 'success'} btn-sm`}
                          title={user.is_active ? 'Desactivar usuaria' : 'Activar usuaria'}
                        >
                          <i className={`fas fa-${user.is_active ? 'user-slash' : 'user-check'}`}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Administradores */}
      <div className="card mb-4">
        <div className="card-header">
          Lista de Administradores
        </div>
        <div className="card-body">
          {admins.length === 0 ? (
            <p className="text-center">No hay administradores registrados.</p>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>
                        {admin.is_active ? (
                          <span className="badge-success">Activo</span>
                        ) : (
                          <span className="badge-danger">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/usuarios/editar/${admin.id}`)}
                          className="btn btn-info btn-sm mr-2"
                          title="Editar administrador"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => toggleUserActiveStatus(admin.id, admin.is_active)}
                          className={`btn btn-${admin.is_active ? 'warning' : 'success'} btn-sm`}
                          title={admin.is_active ? 'Desactivar administrador' : 'Activar administrador'}
                        >
                          <i className={`fas fa-${admin.is_active ? 'user-slash' : 'user-check'}`}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
