import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Diagnosticos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener el estado pasado desde HistoriasClinicas
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [error, setError] = useState(null);

  const historiaClinica = location.state?.historiaClinica; // Obtiene la historia clínica del estado

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/10007/Diagnosticos`, { //Harcodeada la HistoriaClinica 10007, enviar el id de la historia clinica del paciente
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Agrega el token como encabezado
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

    fetchDiagnosticos();
  }, [id]);

  const handleBack = () => {
    navigate('/historiasclinicas', { state: { historiaClinica } }); // Regresa a HistoriasClinicas con el estado
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-blue-800 font-bold text-xl hover:underline"
          >
            ← Volver
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800">Diagnósticos del Paciente</h2>
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
