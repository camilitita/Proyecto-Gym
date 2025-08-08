import React, { useEffect, useState } from 'react';

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

  const fetchAccesos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await fetch(`http://localhost:5001/api/registro-acceso?${params.toString()}`);
      const data = await res.json();
      setAccesos(data.data || []);
    } catch (err) {
      console.error('❌ Error al cargar accesos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccesos();
  }, []); // Carga inicial

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
                    <td>{new Date(a.fecha_acceso).toLocaleString()}</td>
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
