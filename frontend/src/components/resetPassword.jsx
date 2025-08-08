import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css';
import MamisFitnessLogoSVG from '../assets/MamisFitnessLogoSVG.png';

const ResetPassword = () => {
  const { token } = useParams();
  console.log("🔍 Token en la URL:", token);

  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);

      if (response.ok) {
        setMessage('✅ Contraseña cambiada correctamente. Redirigiendo al login...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage(data.message || 'Hubo un error al restablecer la contraseña.');
      }
    } catch (err) {
      setMessage('❌ Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-wrapper">
        <h2 className="login-greeting">Nueva Contraseña</h2>
        <img src={MamisFitnessLogoSVG} alt="Mamis Fitness Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group simple-input">
            <label htmlFor="password" className="sr-only">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña"
              required
              disabled={isLoading}
            />
          </div>
          {message && <div className="login-error-message">{message}</div>}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
