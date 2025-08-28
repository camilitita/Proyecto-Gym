import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditarUsuario.css'; // nuevo CSS cohesivo

const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        qr_code: null,
        role: '',
        is_active: true
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/users/${id}`);
            setFormData({
            name: response.data.name,
            email: response.data.email,
            qr_code: response.data.qr_code,
            role: response.data.role,
            is_active: response.data.is_active
            });
            setLoading(false);
        } catch (err) {
            console.error("Error al cargar datos del usuario:", err);
            setError("No se pudieron cargar los datos del usuario.");
            setLoading(false);
        }
        };
        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
        const response = await axios.put(`http://localhost:5001/api/users/${id}`, {
            name: formData.name,
            email: formData.email,
            qr_code: formData.qr_code,
            role: formData.role,
            is_active: formData.is_active
        });

        if (response.status === 200) {
            setMessage('Usuaria actualizada exitosamente.');
            setTimeout(() => {
            navigate('/admin/usuarios');
            }, 1500);
        } else {
            setMessage('Actualización completada, pero respuesta inesperada.');
        }
        } catch (err) {
        console.error('Error al actualizar usuaria:', err);
        if (err.response) {
            setError(err.response.data.message || 'Error en el servidor al actualizar usuaria.');
        } else if (err.request) {
            setError('No se pudo conectar con el servidor.');
        } else {
            setError('Error desconocido al enviar la solicitud.');
        }
        }
    };

    if (loading) return <p className="text-center mt-5">Cargando datos de usuaria...</p>;
    if (error && !formData.name) return <p className="text-center mt-5 text-danger">{error}</p>;

    return (
        <div className="registro-container">
        <div className="registro-usuario">
            <h2>Editar Usuario</h2>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Rol</label>
                <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                >
                <option value="">Seleccione un rol</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                </select>
            </div>

            <button className='save' type="submit"> Guardar Cambios</button>
            <button  className='cancel'
                type="button"
                style={{ marginTop: "10px" }}
                onClick={() => navigate('/admin/usuarios')}
            >
                Cancelar
            </button>
            </form>
        </div>
        </div>
    );
};

export default EditarUsuario;
