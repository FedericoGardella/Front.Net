import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetalleGrupoCitas = () => {
  const { grupoCitaId } = useParams(); // Obtiene el ID del grupo de citas desde la URL
  const navigate = useNavigate();

  const [grupoCita, setGrupoCita] = useState(null);
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupoCita = async () => {
      try {
        setError(null);
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/grupos-citas/${grupoCitaId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los detalles del grupo de citas.');
        }

        const data = await response.json();
        setGrupoCita(data);
        setCitas(data.citas); // Las citas vienen como parte del grupo de citas
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrupoCita();
  }, [grupoCitaId]);

  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 font-semibold">Cargando detalles del grupo de citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <button
          onClick={handleBack}
          className="text-blue-800 font-bold text-lg hover:underline"
        >
          ← Volver
        </button>

        {/* Información del Grupo de Citas */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-green-800">
            Detalles del Grupo de Citas
          </h2>
          <p className="text-lg">
            <strong>Médico:</strong> {grupoCita.medicoNombre}
          </p>
          <p className="text-lg">
            <strong>Especialidad:</strong> {grupoCita.especialidadNombre}
          </p>
          <p className="text-lg">
            <strong>Fecha:</strong> {new Date(grupoCita.fecha).toLocaleDateString()}
          </p>
        </div>

        {/* Tabla de Citas */}
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(cita.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleGrupoCitas;
