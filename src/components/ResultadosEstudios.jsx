import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ResultadosEstudios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const documento = location.state?.documento; // Obtenemos el documento si está disponible
  const historiaClinica = location.state?.historiaClinica; // Obtenemos la historia clínica si está disponible

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/ResultadoEstudios`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los resultados de estudios');
        }

        const data = await response.json();
        setResultados(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchResultados();
  }, [id]);

  const handleBack = () => {
    if (historiaClinica) {
      navigate(`/consultas/${id}`, { state: { historia: historiaClinica, documento } });
    } else {
      setError('No se puede volver porque falta información de la consulta.');
    }
  };

  const handleCreate = () => {
    navigate(`/resultadosestudios/${id}/create`, { state: { documento, historiaClinica } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-green-800 font-bold text-xl hover:underline"
          >
            <span className="mr-2">←</span>
            <span>Volver</span>
          </button>
          <h2 className="text-2xl font-bold text-center text-green-800">{`Resultados de estudios de la consulta n. ${historiaClinica?.id || id}`}</h2>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            + Nuevo Resultado
          </button>
        </div>

        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {resultados.map((resultado) => (
              <div key={resultado.id} className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-xl font-bold text-green-700 mb-2">Resultado ID: {resultado.id}</p>
                <p className="text-lg"><strong>Descripción:</strong> {resultado.descripcion}</p>
                <p className="text-lg"><strong>Fecha:</strong> {new Date(resultado.fecha).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadosEstudios;
