import React from 'react';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Bienvenido a Nuestra Aplicación</h1>
        <p className="text-lg text-gray-700">
          Esta plataforma está diseñada para la gestión de pacientes y sus historias clínicas. Accede a las diferentes funcionalidades desde la barra de navegación.
        </p>
      </div>
    </div>
  );
};

export default Home;
