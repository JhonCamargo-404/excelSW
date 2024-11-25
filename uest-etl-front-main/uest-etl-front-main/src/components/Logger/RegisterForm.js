import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

            if (!response.ok) throw new Error('Error al registrar usuario');

            setMessage('Registro exitoso. Redirigiendo a login...');
            setTimeout(() => navigate('/logger'), 2000); // Redirigir a login después de 2 segundos
        } catch (error) {
            setMessage(error.message);
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
