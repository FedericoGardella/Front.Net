import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConsultaCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener datos iniciales desde el estado y localStorage
  const pacienteDoc = location.state?.documento || '';
  const pacienteId = location.state?.pacienteId || '';
  const citaId = location.state?.citaId || '';
  const nombreMedico = localStorage.getItem('nombre') || '';
  const fechaCreacion = new Date().toISOString(); // Fecha actual en formato ISO

  const [comentarios, setComentarios] = useState('');
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!comentarios.trim()) {
      setError('El campo de comentarios es obligatorio.');
      return;
    }

    const nuevaConsulta = {
      pacienteId,
      fechaCreacion,
      comentarios,
      nombreMedico,
      citaId,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/HistoriasClinicas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaConsulta),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la nueva consulta.');
      }

      navigate('/historiasclinicas', { state: { documento: pacienteDoc, pacienteId } }); // Volver a Historias Clínicas
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate('/historiasclinicas', { state: { documento: pacienteDoc, pacienteId } });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Crear Nueva Consulta</h2>
        {error && <p className="text-center text-red-500 font-semibold mb-4">{error}</p>}

        <div className="space-y-4">
          <p>
            <strong>Documento del Paciente:</strong> {pacienteDoc}
          </p>
          <p>
            <strong>Fecha de Creación:</strong> {new Date(fechaCreacion).toLocaleString()}
          </p>
          <p>
            <strong>Nombre del Médico:</strong> {nombreMedico}
          </p>
          <p>
            <strong>ID de Cita:</strong> {citaId || 'No asociado a ninguna cita'}
          </p>

          {/* Campo para ingresar comentarios */}
          <textarea
            placeholder="Ingrese comentarios sobre la consulta"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
          />
        </div>

        <div className="flex justify-between mt-6">
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

export default ConsultaCreate;
