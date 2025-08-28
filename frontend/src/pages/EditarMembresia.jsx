import React, { useState, useEffect } from 'react';
import './EditarMembresia.css';
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
  <div className="registro-container">
    <div className="registro-usuario">
      <h2>Editar Membresía</h2>

      {message && (
        <div className="alert success" role="alert">
          {message}
        </div>
      )}
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start_date">Fecha de Inicio</label>
          <input
            type="date"
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
            id="is_active"
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
          >
            <option value="true">Activa</option>
            <option value="false">Inactiva</option>
          </select>
        </div>

        <button type="submit">
          Guardar Cambios
        </button>
        <button
          type="button"
          style={{ marginTop: "10px" }}
          onClick={() => navigate('/admin/membresias')}
        >
          Cancelar
        </button>
      </form>
    </div>
  </div>
  );

};

export default EditarMembresia;
