import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MedicosList = () => {
  const [medicos, setMedicos] = useState([]);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8082/api/Medicos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener la lista de médicos.');
        }

        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMedicos();
  }, []);

  const handleEliminarMedico = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/Medicos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.statusMessage || 'Error al eliminar el médico.');
      }

      setMedicos((prevMedicos) => prevMedicos.filter((medico) => medico.id !== id));
      setStatusMessage('Médico eliminado exitosamente.');
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setShowModal(false); // Cerrar el modal después de intentar eliminar
    }
  };

  const handleEditarMedico = (id) => {
    navigate(`/medicos/editar/${id}`);
  };

  const openModal = (medico) => {
    setSelectedMedico(medico);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedMedico(null);
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Lista de Médicos
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
        {medicos.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">Documento</th>
                <th className="border border-gray-300 px-4 py-2">Matrícula</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr
                  key={medico.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {medico.nombres} {medico.apellidos}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{medico.documento}</td>
                  <td className="border border-gray-300 px-4 py-2">{medico.matricula}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditarMedico(medico.id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openModal(medico)}
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
          <p className="text-center text-gray-600">No hay médicos registrados.</p>
        )}

        {/* Modal de confirmación */}
        {showModal && selectedMedico && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold text-red-600">
                Confirmar Eliminación
              </h3>
              <p className="mt-4">
                ¿Está seguro que desea eliminar al médico{' '}
                <strong>{selectedMedico.nombres} {selectedMedico.apellidos}</strong>?
              </p>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminarMedico(selectedMedico.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicosList;
