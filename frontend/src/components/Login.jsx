import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import MamisFitnessLogoSVG from '../assets/MamisFitnessLogoSVG.png';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIsLoggedIn(true);
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            } else {
                setError(data.message);
                setIsLoading(false);
            }
        } catch (err) {
            setError('Error al conectar con el servidor. ¿Está el backend en funcionamiento?');
            setIsLoading(false);
        }
    };

        const handleForgotPassword = async () => {
    try {
    const res = await fetch('http://localhost:5001/api/admin/send-reset-email', {
        method: 'POST',
    });
    const data = await res.json();
    alert(data.message);
    } catch (error) {
    alert('Error al enviar el correo');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="login-wrapper">
            <div className="bg-circle bg-circle-yellow bg-circle-top-left"></div>
            <div className="bg-circle bg-circle-orange bg-circle-bottom-right"></div>
            <div className="bg-diagonal bg-diagonal-tr"></div>
            <div className="bg-diagonal bg-diagonal-bl"></div>

            <div className="login-form-wrapper">
                <div className="login-header-wrapper">
                    <img src={MamisFitnessLogoSVG} alt="Mamis Fitness Logo" className="login-logo" />
                    <h2 className="login-greeting">Por favor, introduzca sus credenciales</h2>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group simple-input">
                        <label htmlFor="username" className="sr-only">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Usuario"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group simple-input">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="login-options">
                        <a href="#" onClick={handleForgotPassword} className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                    {error && <div className="login-error-message">{error}</div>}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Log in'}
                    </button>
                </form>
            </div>

            {isLoggedIn && (
                <div className="welcome-screen">
                    <h1 className="welcome-message">¡Bienvenida de vuelta, administradora!</h1>
                </div>
            )}
        </div>
    );
};

export default Login;