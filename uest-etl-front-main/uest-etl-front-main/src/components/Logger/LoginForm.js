import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
                body: new URLSearchParams({ username, password }),
            });

            if (!response.ok) throw new Error('Credenciales incorrectas');

            const data = await response.json();
            localStorage.setItem('token', data.access_token); // Guardar el token
            setMessage('Inicio de sesión exitoso. Redirigiendo...');
            setTimeout(() => navigate('/app'), 2000); // Redirigir a la app principal después de 2 segundos
        } catch (error) {
            setMessage(error.message);
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
