import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const CrearResultadoEstudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const documento = location.state?.documento; // Recibimos el documento
  const historiaClinica = location.state?.historiaClinica; // Recibimos la historia clínica

  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    const nuevoResultado = {
      descripcion,
      fecha: new Date().toISOString(),
      historiaClinicaId: Number(id),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/ResultadosEstudios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoResultado),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el resultado de estudio');
      }

      navigate(`/resultadosestudios/${id}`, { state: { documento, historiaClinica } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate(`/resultadosestudios/${id}`, { state: { documento, historiaClinica } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full flex flex-col">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Crear Nuevo Resultado</h2>
        {error && <p className="text-center text-red-500 font-semibold mb-4">{error}</p>}

        <textarea
          placeholder="Descripción del resultado"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100 text-gray-700 mb-6"
        />

        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearResultadoEstudio;
