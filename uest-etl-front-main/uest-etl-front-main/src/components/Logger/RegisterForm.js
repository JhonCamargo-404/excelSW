import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { API_BASE_URL } from '../../config';


const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook para redireccionar

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            // Notificación de éxito al registrarse
            notification.success({
                message: 'Registro exitoso',
                description: 'Te has registrado correctamente. Ahora puedes iniciar sesión.',
            });

            setTimeout(() => {
                navigate('/login'); // Redirigir a la página de login
            }, 2000); // Espera 2 segundos antes de redirigir
        } catch (error) {
            // Notificación de error
            notification.error({
                message: 'Error en el registro',
                description: error.message || 'Hubo un problema al registrarte.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Regístrate</h2>
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
            <button type="submit">Registrarse</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default RegisterForm;
