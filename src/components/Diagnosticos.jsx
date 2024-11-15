import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Diagnosticos = () => {
  const { id } = useParams();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/diagnosticos`);
        if (!response.ok) {
          throw new Error('Error al obtener los diagnósticos');
        }
        const data = await response.json();
        setDiagnosticos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDiagnosticos();
  }, [id]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Diagnósticos del Paciente</h2>
        
        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {diagnosticos.map((diag) => (
              <div key={diag.id} className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xl font-bold text-blue-700 mb-2">Diagnóstico ID: {diag.id}</p>
                <p className="text-lg"><strong>Descripción:</strong> {diag.descripcion}</p>
                <p className="text-lg"><strong>Fecha:</strong> {new Date(diag.fecha).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnosticos;
