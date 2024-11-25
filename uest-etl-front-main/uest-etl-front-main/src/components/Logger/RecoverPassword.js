import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';

const RecoverPassword = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/users/recover-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) throw new Error('Error al recuperar contraseña');

            setMessage('Se ha enviado un correo con instrucciones.');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nombre de usuario o correo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <button type="submit">Recuperar Contraseña</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default RecoverPassword;
