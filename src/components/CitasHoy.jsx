import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CitasHoy = () => {
  const [grupoCitas, setGrupoCitas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitasHoy = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtiene el token del localStorage
        const medicoId = localStorage.getItem('idUsuario'); // Obtiene el id del médico del localStorage
        const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        if (!medicoId) {
          throw new Error('No se encontró el ID del médico en el localStorage.');
        }

        const response = await fetch(
          `http://localhost:8084/api/HandlerCitas/CitasHoy?medicoId=${medicoId}&fecha=${today}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setGrupoCitas(null);
          } else {
            throw new Error('Error al obtener el grupo de citas');
          }
        } else {
          const data = await response.json();
          setGrupoCitas(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasHoy();
  }, []);

  const handleCitaClick = (pacienteId) => {
    navigate('/historiasclinicas', { state: { pacienteId } });
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!grupoCitas) {
    return <p className="text-center text-gray-500">No hay citas para hoy.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Citas de Hoy</h2>
        <div className="space-y-4">
          <p><strong>Lugar:</strong> {grupoCitas.lugar}</p>
          <p><strong>Fecha:</strong> {new Date(grupoCitas.fecha).toLocaleDateString()}</p>
          <h3 className="text-2xl font-bold text-blue-700">Citas:</h3>
          <ul className="list-disc pl-6">
            {grupoCitas.citas.map((cita) => (
              <li
                key={cita.id}
                className="mb-4 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleCitaClick(cita.pacienteId)}
              >
                <p><strong>Paciente:</strong> {cita.pacienteId}</p>
                <p><strong>Hora:</strong> {new Date(`1970-01-01T${cita.hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CitasHoy;

