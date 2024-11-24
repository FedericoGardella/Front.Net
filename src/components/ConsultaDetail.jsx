import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConsultaDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const consulta = location.state?.historia;
  const documento = location.state?.documento; // Recibimos el documento del paciente

  if (!consulta) {
    return <p className="text-center text-red-500 font-bold">No se encontró información de la consulta.</p>;
  }

  const handleNavigation = (path) => {
    navigate(path, { state: { historiaClinica: consulta, documento } }); // Incluimos el documento
  };

  const handleBackClick = () => {
    navigate('/historiasclinicas', { state: { documento } }); // Regresamos a HistoriasClinicas con el documento
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full text-gray-800 relative">
        {/* Botón para volver */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-800 font-bold text-xl hover:underline"
          >
            <span className="mr-2">←</span>
            <span>Volver</span>
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800 w-full">Detalles de la Consulta</h2>
        </div>

        <div className="space-y-4 mb-8">
          <p><strong>ID:</strong> {consulta.id}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(consulta.fechaCreacion).toLocaleDateString()}</p>
          <p><strong>Comentarios:</strong> {consulta.comentarios || 'No disponible'}</p>
          <p><strong>Médico:</strong> {consulta.nombreMedico || 'No disponible'}</p>
          <p><strong>ID Cita:</strong> {consulta.citaId}</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleNavigation(`/diagnosticos/${consulta.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Diagnósticos
          </button>
          <button
            onClick={() => handleNavigation(`/resultadosestudios/${consulta.id}`)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Resultados Estudios
          </button>
          <button
            onClick={() => handleNavigation(`/recetas/${consulta.id}`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Recetas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultaDetail;
