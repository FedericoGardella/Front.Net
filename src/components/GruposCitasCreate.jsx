import React, { useState, useEffect } from 'react';

const GruposCitasCreate = () => {
  const [formData, setFormData] = useState({
    lugar: '',
    fecha: '',
    medicoId: '',
    especialidadId: '',
    horaInicio: '',
    cantidadCitas: '',
    intervaloMinutos: '',
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8081/api/Especialidades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las especialidades.');
        }

        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const cargarMedicos = async () => {
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
          throw new Error('Error al obtener los médicos.');
        }

        const data = await response.json();
        setMedicos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    cargarEspecialidades();
    cargarMedicos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Añadir ":00" para incluir segundos en la horaInicio
      const horaConSegundos = `${formData.horaInicio}:00`;

      const requestBody = {
        lugar: formData.lugar,
        fecha: new Date(formData.fecha).toISOString(), // Formato ISO para la fecha
        medicoId: parseInt(formData.medicoId, 10), // Asegurar número
        especialidadId: parseInt(formData.especialidadId, 10), // Asegurar número
        horaInicio: horaConSegundos,
        cantidadCitas: parseInt(formData.cantidadCitas, 10), // Asegurar número
        intervaloMinutos: parseInt(formData.intervaloMinutos, 10), // Asegurar número
      };

      const response = await fetch('http://localhost:8083/api/GruposCitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setStatusMessage('Grupo de citas creado exitosamente.');
        setFormData({
          lugar: '',
          fecha: '',
          medicoId: '',
          especialidadId: '',
          horaInicio: '',
          cantidadCitas: '',
          intervaloMinutos: '',
        });
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.mensaje || 'Error al crear el grupo de citas.');
      }
    } catch (error) {
      setStatusMessage('Error al crear el grupo de citas.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Crear Grupo de Citas</h2>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="lugar"
              placeholder="Lugar"
              value={formData.lugar}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <select
              name="medicoId"
              value={formData.medicoId}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            >
              <option value="">Seleccione un Médico</option>
              {medicos.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.apellidos}, {medico.nombres}
                </option>
              ))}
            </select>
            <select
              name="especialidadId"
              value={formData.especialidadId}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            >
              <option value="">Seleccione una Especialidad</option>
              {especialidades.map((especialidad) => (
                <option key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
            <input
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <input
              type="number"
              name="cantidadCitas"
              placeholder="Cantidad de Citas"
              value={formData.cantidadCitas}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <input
              type="number"
              name="intervaloMinutos"
              placeholder="Intervalo entre Citas (min)"
              value={formData.intervaloMinutos}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Grupo de Citas
          </button>
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

export default GruposCitasCreate;
