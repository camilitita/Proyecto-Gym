import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarMembresia = () => {
  const { id } = useParams(); // ID de la membresía de la URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    is_active: 'true', // ahora string para el select
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/memberships/${id}`);
        const membership = response.data.data; // Asumiendo que la API devuelve los datos en response.data.data

        // Formatear las fechas a YYYY-MM-DD para el input type="date"
        const formattedStartDate = membership.start_date
          ? new Date(membership.start_date).toISOString().split('T')[0]
          : '';
        const formattedEndDate = membership.end_date
          ? new Date(membership.end_date).toISOString().split('T')[0]
          : '';

        setFormData({
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          is_active: membership.is_active ? 'true' : 'false', // convertir booleano a string para el select
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos de la membresía:', err);
        setError('No se pudieron cargar los datos de la membresía.');
        setLoading(false);
      }
    };
    fetchMembershipData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Convertir is_active string a boolean
      const isActiveBoolean = formData.is_active === 'true';

      const response = await axios.put(`http://localhost:5001/api/memberships/${id}`, {
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: isActiveBoolean,
      });

      if (response.status === 200) {
        // Verificar si la membresía debe ir a inactivos (fecha fin < hoy)
        const today = new Date();
        const endDate = new Date(formData.end_date);

        let extraMessage = '';
        if (endDate < today) {
          extraMessage = 'La membresía ha sido movida a inactiva por la fecha de vencimiento.';
        }

        setMessage('Membresía actualizada exitosamente. ' + extraMessage);

        setTimeout(() => {
          navigate('/admin/membresias'); // Redirige a la lista de membresías
        }, 2000);
      } else {
        setMessage('Actualización completada, pero respuesta inesperada.');
      }
    } catch (err) {
      console.error('Error al actualizar membresía:', err);
      if (err.response) {
        setError(err.response.data.message || 'Error en el servidor al actualizar membresía.');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError('Error desconocido al enviar la solicitud.');
      }
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando datos de membresía...</p>;
  if (error && !formData.start_date) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Editar Membresía</h1>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Formulario de Edición de Membresía</h6>
        </div>
        <div className="card-body">
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="start_date">Fecha de Inicio</label>
              <input
                type="date"
                className="form-control"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">Fecha de Vencimiento</label>
              <input
                type="date"
                className="form-control"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="is_active">Estado de la Membresía</label>
              <select
                className="form-control"
                id="is_active"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              <i className="fas fa-save mr-2"></i> Guardar Cambios
            </button>
            <button
              type="button"
              className="btn btn-secondary mt-3 ml-2"
              onClick={() => navigate('/admin/membresias')}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarMembresia;
