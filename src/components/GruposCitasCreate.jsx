import React, { useState } from 'react';

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

  const [statusMessage, setStatusMessage] = useState(null);

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
            <input
              type="number"
              name="medicoId"
              placeholder="ID del Médico"
              value={formData.medicoId}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <input
              type="number"
              name="especialidadId"
              placeholder="ID de la Especialidad"
              value={formData.especialidadId}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
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
