import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { API_BASE_URL } from '../../config';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook para redireccionar

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password }), // Enviar credenciales al backend
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token); // Guardar el token

            // Notificación de éxito al loguearse
            notification.success({
                message: 'Inicio de sesión exitoso',
                description: 'Has iniciado sesión correctamente.',
            });

            setTimeout(() => {
                navigate('/app'); // Redirigir a la aplicación principal
            }, 2000); // Espera 2 segundos antes de redirigir
        } catch (error) {
            // Notificación de error
            notification.error({
                message: 'Error en el inicio de sesión',
                description: error.message || 'Hubo un problema al iniciar sesión.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inicia Sesión</h2>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Iniciar Sesión</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default LoginForm;
