import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarPaciente = () => {
  const { id } = useParams(); // Obtener el ID del paciente desde la URL
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState({
    nombres: '',
    apellidos: '',
    documento: '',
    telefono: '',
  });
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar los datos del paciente al montar el componente
    const fetchPaciente = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8082/api/Pacientes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del paciente.');
        }

        const data = await response.json();
        setPaciente({
          nombres: data.nombres,
          apellidos: data.apellidos,
          documento: data.documento,
          telefono: data.telefono,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/api/Pacientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paciente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.statusMessage || 'Error al actualizar el paciente.');
      }

      setStatusMessage('Paciente actualizado exitosamente.');
      setTimeout(() => navigate('/pacientes'), 2000); // Redirigir después de 2 segundos
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  if (loading) {
    return <p className="text-center text-white font-semibold text-2xl">Cargando datos del paciente...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Editar Paciente</h2>
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombres" className="block text-sm font-semibold text-gray-700 mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                id="nombres"
                placeholder="Nombres"
                value={paciente.nombres}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="apellidos" className="block text-sm font-semibold text-gray-700 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                id="apellidos"
                placeholder="Apellidos"
                value={paciente.apellidos}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="documento" className="block text-sm font-semibold text-gray-700 mb-1">
                Documento
              </label>
              <input
                type="text"
                name="documento"
                id="documento"
                placeholder="Documento"
                value={paciente.documento}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                id="telefono"
                placeholder="Teléfono"
                value={paciente.telefono}
                onChange={handleInputChange}
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
        {statusMessage && (
          <p
            className={`text-center font-semibold mt-4 ${
              statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditarPaciente;
