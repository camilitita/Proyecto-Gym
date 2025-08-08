import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
                    // Ruta corregida: redirige a la lista de usuarios
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
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Editar Usuaria</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Formulario de Edición</h6>
                </div>
                <div className="card-body">
                    {message && <div className="alert alert-success" role="alert">{message}</div>}
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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

                        <button type="submit" className="btn btn-primary mt-3">
                            <i className="fas fa-save mr-2"></i> Guardar Cambios
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary mt-3 ml-2"
                            // Ruta corregida para el botón de cancelar
                            onClick={() => navigate('/admin/usuarios')}
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarUsuario;