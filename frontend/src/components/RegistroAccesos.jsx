import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const RegistroAccesos = () => {
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    usuario_id: '',
    admin_id: '',
  });

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAccesos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value) {
          if (key === 'hasta') {
            params.append(key, `${value}T23:59:59`);
          } else {
            params.append(key, value);
          }
        }
      });

      const res = await fetch(`http://localhost:5001/api/registro-acceso?${params.toString()}`);
      const data = await res.json();
      setAccesos(data.data || []);
    } catch (err) {
      console.error('❌ Error al cargar accesos:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchAccesos();
  }, [fetchAccesos]);

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchAccesos();
  };

  const handleLimpiar = () => {
    setFiltros({
      desde: '',
      hasta: '',
      usuario_id: '',
      admin_id: '',
    });
    fetchAccesos();
  };

const formatFechaCaracas = (fecha) => {
  return new Date(fecha).toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};



  return (
    <div className="container mt-4">
      <h2 className="mb-4">Registro de Accesos</h2>

      <form className="mb-4" onSubmit={handleFiltrar}>
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Desde:</label>
            <input
              type="date"
              name="desde"
              className="form-control"
              value={filtros.desde}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Hasta:</label>
            <input
              type="date"
              name="hasta"
              className="form-control"
              value={filtros.hasta}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">ID Usuario:</label>
            <input
              type="number"
              name="usuario_id"
              className="form-control"
              value={filtros.usuario_id}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">ID Admin:</label>
            <input
              type="number"
              name="admin_id"
              className="form-control"
              value={filtros.admin_id}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary me-2 w-100">Filtrar</button>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="button" className="btn btn-secondary w-100" onClick={handleLimpiar}>Limpiar</button>
          </div>
        </div>
      </form>

      {loading ? (
        <p>Cargando registros...</p>
      ) : (
        <div className="table-responsive">
          {accesos.length === 0 ? (
            <p>No hay resultados para los filtros seleccionados.</p>
          ) : (
            <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Email Usuario</th>
                  <th>Escaneado por</th>
                  <th>Email Admin</th>
                </tr>
              </thead>
              <tbody>
                {accesos.map((a) => (
                  <tr key={a.id}>
                    <td>{formatFechaCaracas(a.fecha_acceso)}</td>
                    <td>{a.usuario_nombre}</td>
                    <td>{a.usuario_email}</td>
                    <td>{a.admin_nombre}</td>
                    <td>{a.admin_email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RegistroAccesos;