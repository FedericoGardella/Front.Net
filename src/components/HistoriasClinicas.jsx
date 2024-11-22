import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HistoriasClinicas = () => {
  const [documento, setDocumento] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pacienteId = location.state?.pacienteId;
    if (pacienteId) {
      handleSearchByDocumento(pacienteId);
    }
  }, [location.state]);  

  const handleChange = (e) => {
    setDocumento(e.target.value);
  };

  const handleSearchByDocumento = async (doc) => {
    try {
      const response = await fetch('http://localhost:8084/api/HistoriasClinicas/MockPacientes');
      if (response.ok) {
        const pacientes = await response.json();
  
        const pacienteEncontrado = pacientes.find(
          (p) => String(p.documento) === String(doc) // Normaliza ambos valores a cadenas
        );
  
        if (pacienteEncontrado) {
          setPaciente(pacienteEncontrado);
          setStatusMessage(null);
          setDocumento(pacienteEncontrado.documento); // Actualiza el campo de búsqueda
        } else {
          setPaciente(null);
          setStatusMessage('Paciente no encontrado');
        }
      } else {
        setStatusMessage('Error al obtener los datos de pacientes');
        setPaciente(null);
      }
    } catch (error) {
      setStatusMessage("Error al buscar el paciente");
      setPaciente(null);
    }
  };  
  

  const handleDiagnosticosClick = () => {
    if (paciente) {
      navigate(`/diagnosticos/${paciente.historiaClinicaId}`, { state: { historiaClinica: paciente } });
    }
  };

  const handleResultadosClick = () => {
    if (paciente?.historiaClinicaId) {
      navigate(`/resultadosestudios/${paciente.historiaClinicaId}`, { state: { historiaClinica: paciente } });
    } else {
      setStatusMessage('No se puede acceder a los estudios: Historia Clínica no definida.');
    }
  };

  const handleRecetasClick = () => {
    if (paciente?.historiaClinicaId) {
      navigate(`/recetas/${paciente.historiaClinicaId}`, { state: { historiaClinica: paciente } });
    } else {
      setStatusMessage('No se puede acceder a las recetas: Historia Clínica no definida.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col justify-start text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Gestión de Historias Clínicas</h2>

        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Ingrese documento del paciente"
              value={documento}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
            />
            <button
              onClick={() => handleSearchByDocumento(documento)}
              className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Buscar
            </button>
          </div>

          {statusMessage && (
            <p className="text-center text-red-500 font-semibold">{statusMessage}</p>
          )}
        </div>

        {paciente && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl relative">
            <h3 className="text-xl font-bold text-blue-700 mb-6">
              Historia Clínica de: <span className="font-normal text-gray-800">{paciente.nombres} {paciente.apellidos}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <p><strong>Documento:</strong> {paciente.documento}</p>
              <p><strong>Teléfono:</strong> {paciente.telefono}</p>
              <p><strong>ID Historia Clínica:</strong> {paciente.historiaClinicaId || 'No disponible'}</p>
            </div>

            <div className="absolute top-6 right-6 space-x-4 flex">
              <button
                onClick={handleDiagnosticosClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                Diagnósticos
              </button>
              <button
                onClick={handleResultadosClick}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
              >
                Estudios
              </button>
              <button
                onClick={handleRecetasClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
              >
                Recetas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoriasClinicas;
