import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PacientesList = () => {
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8082/api/Pacientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la lista de pacientes.');
        }

        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPacientes();
  }, []);

  const handleEliminarPaciente = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/Pacientes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.statusMessage || 'Error al eliminar el paciente.');
      }

      setPacientes((prevPacientes) => prevPacientes.filter((paciente) => paciente.id !== id));
      setStatusMessage('Paciente eliminado exitosamente.');
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const handleEditarPaciente = (id) => {
    navigate(`/pacientes/editar/${id}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Lista de Pacientes
        </h2>
        {error && (
          <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
        )}
        {statusMessage && (
          <p
            className={`text-center font-semibold mb-4 ${
              statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {statusMessage}
          </p>
        )}
        {pacientes.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Documento</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {paciente.nombre} {paciente.apellido}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{paciente.documento}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditarPaciente(paciente.id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarPaciente(paciente.id)}
                      className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No hay pacientes registrados.</p>
        )}
      </div>
    </div>
  );
};

export default PacientesList;
