import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import RecoverPassword from './RecoverPassword';
import '../../styles/AuthForm.css'; // Puedes agregar estilos personalizados

const LoggerBanner = () => {
    const [view, setView] = useState('login'); // Controla la vista actual

    return (
        <div className="logger-banner">
            <div className="form-container">
                {view === 'login' && (
                    <>
                        <h2>Bienvenido de Nuevo</h2>
                        <LoginForm />
                        <p>
                            ¿No tienes cuenta?{' '}
                            <span className="link" onClick={() => setView('register')}>
                                Regístrate aquí
                            </span>
                        </p>
                    </>
                )}
                {view === 'register' && (
                    <>
                        <h2>Regístrate</h2>
                        <RegisterForm />
                        <p>
                            ¿Ya tienes una cuenta?{' '}
                            <span className="link" onClick={() => setView('login')}>
                                Inicia sesión
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoggerBanner;
