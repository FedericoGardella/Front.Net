// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8082/api/Auth/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.statusMessage || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Almacena el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Actualizar estado de autenticación
      onLogin();

      // Navegar a la ruta protegida o al home
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="bg-neutral-800/70 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
