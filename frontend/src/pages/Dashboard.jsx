import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Simular datos o cargarlos desde el backend
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [ultimosIngresos, setUltimosIngresos] = useState([]);

  useEffect(() => {
    // Aquí harías tus llamadas al backend para obtener los datos
    // Ejemplo con datos simulados:
    setIngresosHoy(1250.00); // USD, o tu moneda
    setUsuariosActivos(45);
    setUltimosIngresos([
      { id: 1, usuario: 'Juan Pérez', hora: '10:00 AM' },
      { id: 2, usuario: 'Maria Gómez', hora: '09:45 AM' },
      { id: 3, usuario: 'Carlos Ruiz', hora: '09:30 AM' },
    ]);

    // Ejemplo con Axios (descomenta y adapta si tienes el backend listo)
    /*
    const fetchDashboardData = async () => {
      try {
        const ingresosRes = await axios.get('/api/ingresos/hoy');
        setIngresosHoy(ingresosRes.data.total);

        const activosRes = await axios.get('/api/usuarios/activos');
        setUsuariosActivos(activosRes.data.count);

        const ultimosRes = await axios.get('/api/ingresos/ultimos');
        setUltimosIngresos(ultimosRes.data.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
    */

  }, []);

  return (
    <div className="dashboard-content">
      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>

      {/* Resumen de Tarjetas */}
      <div className="row">
        {/* Earnings (Daily) Card Example */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Ingresos del Día
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">${ingresosHoy.toFixed(2)}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users Card Example */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Usuarios Activos
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{usuariosActivos}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Puedes añadir más cards aquí */}
      </div>

        {/* Sección de Acciones Rápidas - ¡NUEVA SECCIÓN! */}
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Acciones Rápidas</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-start flex-wrap"> {/* Flexbox para alinear botones */}
                <Link to="/admin/usuarios/registro" className="btn btn-primary btn-icon-split btn-lg mr-2 mb-2">
                  <span className="icon text-white-50">
                    <i className="fas fa-user-plus"></i>
                  </span>
                  <span className="text">Registrar Nueva Usuaria</span>
                </Link>
                <Link to="/admin/membresias" className="btn btn-info btn-icon-split btn-lg mb-2">
                  <span className="icon text-white-50">
                    <i className="fas fa-credit-card"></i>
                  </span>
                  <span className="text">Ver Membresías</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Ultimos Ingresos (Tabla) */}
      <div className="row">
        <div className="col-lg-12 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Últimos Registros de Acceso</h6>
            </div>
            <div className="card-body">
              {ultimosIngresos.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                    <thead>
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
      </div>
    </div>
  );
};

export default Dashboard;