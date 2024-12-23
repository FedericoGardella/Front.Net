import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CitasHoy = () => {
  const [grupoCitas, setGrupoCitas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pacientesInfo, setPacientesInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitasHoy = async () => {
      try {
        const token = localStorage.getItem('token');
        const medicoId = localStorage.getItem('idUsuario');
        const today = new Date().toISOString().split('T')[0];

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
          // Filtrar citas que tienen pacienteId distinto de null
          data.citas = data.citas.filter((cita) => cita.pacienteId !== null);

          setGrupoCitas(data);

          // Obtener información de los pacientes
          const pacientes = await fetchPacientesInfo(data.citas);
          setPacientesInfo(pacientes);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitasHoy();
  }, []);

  const fetchPacientesInfo = async (citas) => {
    const token = localStorage.getItem('token');
    const pacientes = {};

    await Promise.all(
      citas.map(async (cita) => {
        try {
          const response = await fetch(
            `http://localhost:8084/api/HandlerCitas/${cita.pacienteId}/GetPaciente`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const pacienteData = await response.json();
            pacientes[cita.pacienteId] = `${pacienteData.nombres} ${pacienteData.apellidos} (${pacienteData.documento})`;
          } else {
            pacientes[cita.pacienteId] = 'Paciente desconocido';
          }
        } catch {
          pacientes[cita.pacienteId] = 'Paciente desconocido';
        }
      })
    );

    return pacientes;
  };

  const handleCitaClick = async (pacienteId, citaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/HandlerCitas/${pacienteId}/GetPaciente`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el documento del paciente');
      }

      const pacienteData = await response.json();

      // Navegar a HistoriasClinicas con el documento y citaId
      navigate('/historiasclinicas', {
        state: { documento: pacienteData.documento, desdeCitasHoy: true, citaId, pacienteId },
      });
    } catch (error) {
      console.error('Error al obtener el documento del paciente:', error);
      setError('No se pudo obtener el documento del paciente.');
    }
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!grupoCitas || grupoCitas.citas.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white shadow-md rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Citas de Hoy</h2>
          <p className="text-lg text-gray-600">No hay citas programadas para hoy.</p>
          <p className="mt-4 text-gray-500">
            Revisa el calendario o vuelve más tarde para consultar nuevas actualizaciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-6 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Citas de Hoy</h2>
        <div className="space-y-4">
          <p>
            <strong>Lugar:</strong> {grupoCitas.lugar}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(grupoCitas.fecha).toLocaleDateString()}
          </p>
          <h3 className="text-2xl font-bold text-blue-700">Citas:</h3>
          <ul className="list-disc pl-6">
            {grupoCitas.citas.map((cita) => (
              <li
                key={cita.id}
                className="mb-4 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleCitaClick(cita.pacienteId, cita.id)}
              >
                <p>
                  <strong>Paciente:</strong>{' '}
                  {pacientesInfo[cita.pacienteId] || 'Cargando información del paciente...'}
                </p>
                <p>
                  <strong>Hora:</strong>{' '}
                  {new Date(`1970-01-01T${cita.hora}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CitasHoy;
