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

      // Guardar datos en localStorage
      localStorage.setItem('token', data.token); // Token de autenticación
      localStorage.setItem('documento', data.documento); // Número de documento
      localStorage.setItem('idUsuario', data.idUsuario); // ID del usuario
      localStorage.setItem('role', data.roles[0]); // Primer (y único) rol del usuario

      // Actualizar estado de autenticación
      onLogin();

      // Navegar a la ruta protegida o al home
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-500 font-semibold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
