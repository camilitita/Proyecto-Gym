import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Membresias = () => {
  const [activeMemberships, setActiveMemberships] = useState([]);
  const [inactiveMemberships, setInactiveMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/memberships');
      const allMemberships = response.data.data; // Asumiendo que la API devuelve los datos en response.data.data

      // Filtrar membresías por estado
      setActiveMemberships(allMemberships.filter(mem => mem.is_active));
      setInactiveMemberships(allMemberships.filter(mem => !mem.is_active));

      setError(null);
    } catch (err) {
      console.error("Error al cargar membresías:", err);
      setError("No se pudieron cargar las membresías.");
      setActiveMemberships([]);
      setInactiveMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formato de fecha local
  };

  if (loading) return <p className="text-center mt-5">Cargando membresías...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Gestión de Membresías</h1>

      {/* Tabla de Membresías Activas */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Membresías Activas</h6>
        </div>
        <div className="card-body">
          {activeMemberships.length === 0 ? (
            <p className="text-center">No hay membresías activas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTableActiveMemberships" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>ID Membresía</th>
                    <th>ID Usuario</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMemberships.map((membership) => (
                    <tr key={membership.id}>
                      <td>{membership.id}</td>
                      <td>{membership.user_id}</td>
                      <td>{formatDate(membership.start_date)}</td>
                      <td>{formatDate(membership.end_date)}</td>
                      <td>
                        {membership.is_active ? (
                          <span className="badge badge-success">Activa</span>
                        ) : (
                          <span className="badge badge-danger">Inactiva</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/membresias/editar/${membership.id}`)}
                          className="btn btn-info btn-sm"
                          title="Editar membresía"
                        >
                          <i className="fas fa-edit"></i>
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

      <hr className="my-5" /> {/* Separador entre tablas */}

      {/* Tabla de Membresías Inactivas */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Membresías Inactivas</h6>
        </div>
        <div className="card-body">
          {inactiveMemberships.length === 0 ? (
            <p className="text-center">No hay membresías inactivas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered" id="dataTableInactiveMemberships" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>ID Membresía</th>
                    <th>ID Usuario</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveMemberships.map((membership) => (
                    <tr key={membership.id}>
                      <td>{membership.id}</td>
                      <td>{membership.user_id}</td>
                      <td>{formatDate(membership.start_date)}</td>
                      <td>{formatDate(membership.end_date)}</td>
                      <td>
                        {membership.is_active ? (
                          <span className="badge badge-success">Activa</span>
                        ) : (
                          <span className="badge badge-danger">Inactiva</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/admin/membresias/editar/${membership.id}`)}
                          className="btn btn-info btn-sm"
                          title="Editar membresía"
                        >
                          <i className="fas fa-edit"></i>
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

export default Membresias;