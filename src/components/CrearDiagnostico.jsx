import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const CrearDiagnostico = () => {
  const { id } = useParams(); // Obtiene el id de la historia clínica desde la URL
  const navigate = useNavigate();
  const location = useLocation();

  const documento = location.state?.documento; // Obtenemos el documento del paciente
  const historiaClinica = location.state?.historiaClinica; // Obtenemos la historia clínica

  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    const nuevoDiagnostico = {
      descripcion,
      fecha: new Date().toISOString(),
      historiaClinicaId: Number(id), // Usa el id de la URL
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Diagnosticos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoDiagnostico),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el diagnóstico');
      }

      // Navegamos a Diagnosticos con los estados necesarios
      navigate(`/diagnosticos/${id}`, { state: { documento, historiaClinica } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    // Navegamos a Diagnosticos con los estados necesarios
    navigate(`/diagnosticos/${id}`, { state: { documento, historiaClinica } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full flex flex-col">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Crear Nuevo Diagnóstico</h2>
        {error && <p className="text-center text-red-500 font-semibold mb-4">{error}</p>}

        <textarea
          placeholder="Descripción del diagnóstico"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700 mb-6"
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearDiagnostico;
