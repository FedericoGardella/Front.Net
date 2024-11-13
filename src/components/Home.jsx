import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="bg-neutral-800/70 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Bienvenido a la Aplicación</h1>
        <p className="text-gray-300 mb-8">
          Esta es una plataforma para gestionar usuarios y pacientes. Inicia sesión o registra un nuevo paciente para comenzar.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/create-user"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors px-4"
          >
            Registrar Paciente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
