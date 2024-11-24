import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Diagnosticos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [error, setError] = useState(null);

  const documento = location.state?.documento;
  const historiaClinica = location.state?.historiaClinica;

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/Diagnosticos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los diagnósticos');
        }

        const data = await response.json();
        setDiagnosticos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    if (id) {
      fetchDiagnosticos();
    }
  }, [id]);

  const handleBack = () => {
    if (historiaClinica) {
      navigate(`/consultas/${historiaClinica.id}`, { state: { historia: historiaClinica, documento } });
    } else {
      setError('No se puede volver porque falta información de la consulta.');
    }
  };

  const handleCreate = () => {
    navigate(`/diagnosticos/${id}/create`, { state: { documento, historiaClinica } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-800 font-bold text-xl hover:underline"
          >
            <span className="mr-2">←</span>
            <span>Volver</span>
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800">{`Diagnósticos de la consulta n. ${historiaClinica?.id || id}`}</h2>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            + Nuevo Diagnóstico
          </button>
        </div>

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
