import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [ultimosIngresos, setUltimosIngresos] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Cantidad de accesos hoy
        const ingresosRes = await axios.get('http://localhost:5001/api/registro-acceso/today');
        setIngresosHoy(ingresosRes.data.count);

        // Cantidad de usuarios activos
        const activosRes = await axios.get('http://localhost:5001/api/users/activos');
        setUsuariosActivos(activosRes.data.count);

        // Últimos 3 accesos
        const ultimosRes = await axios.get('http://localhost:5001/api/registro-acceso/ultimos?limit=3');
        const ultimos = ultimosRes.data.data.map((item) => ({
          id: item.id,
          usuario: item.usuario_nombre,
          hora: new Date(item.fecha_acceso).toLocaleTimeString('es-VE', { hour12: false })
        }));
        setUltimosIngresos(ultimos);

      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-content">
      <h1 className="h3 mb-4 text-gray-800"> Dashboard de Gestión</h1>

      {/* Grid de tarjetas de resumen */}
      <div className="dashboard-grid">
        <div className="card border-left-primary shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                  Accesos del Día
                </div>
                <div className="h5 mb-0 font-weight-bold">{ingresosHoy}</div>
              </div>
              <div className="col-auto">
                <i className="fas fa-calendar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-left-success shadow h-100 py-2">
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Usuarios Activos
                </div>
                <div className="h5 mb-0 font-weight-bold">{usuariosActivos}</div>
              </div>
              <div className="col-auto">
                <i className="fas fa-users fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Acciones Rápidas</h6>
        </div>
        <div className="card-body actions-container">
          <Link to="/admin/usuarios/registro" className="btn btn-primary btn-icon-split btn-lg">
            <span className="icon text-white-50">
              <i className="fas fa-user-plus"></i>
            </span>
            <span className="text">Registrar Nueva Usuaria</span>
          </Link>
          <Link to="/admin/membresias" className="btn btn-info btn-icon-split btn-lg">
            <span className="icon text-white-50">
              <i className="fas fa-credit-card"></i>
            </span>
            <span className="text">Ver Membresías</span>
          </Link>
        </div>
      </div>

      {/* Últimos Accesos */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Últimos Registros de Acceso</h6>
        </div>
        <div className="card-body">
          {ultimosIngresos.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead className="header">
                  <tr>
                    <th>Usuario</th>
                    <th>Hora de Ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosIngresos.map((ingreso) => (
                    <tr key={ingreso.id}>
                      <td>{ingreso.usuario}</td>
                      <td>{ingreso.hora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay registros de acceso recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
