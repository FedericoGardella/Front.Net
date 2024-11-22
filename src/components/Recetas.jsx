import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Recetas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(null);

  const historiaClinica = location.state?.historiaClinica;

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/Recetas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las recetas');
        }

        const data = await response.json();
        setRecetas(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecetas();
  }, [id]);

  const handleBack = () => {
    navigate('/historiasclinicas', { state: { historiaClinica } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-700 to-purple-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-indigo-800 font-bold text-xl hover:underline"
          >
            ← Volver
          </button>
          <h2 className="text-3xl font-bold text-center text-indigo-800">Recetas del Paciente</h2>
        </div>

        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {recetas.map((receta) => (
              <div key={receta.id} className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-xl font-bold text-indigo-700 mb-2">Receta ID: {receta.id}</p>
                <p className="text-lg"><strong>Descripción:</strong> {receta.descripcion}</p>
                <p className="text-lg"><strong>Fecha:</strong> {new Date(receta.fecha).toLocaleDateString()}</p>
                <p className="text-lg"><strong>Tipo:</strong> {receta.tipo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recetas;
