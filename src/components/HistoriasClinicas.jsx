import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const HistoriasClinicas = () => {
  const [documento, setDocumento] = useState('');
  const [historias, setHistorias] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica si la navegación proviene de CitasHoy
  const desdeCitasHoy = location.state?.desdeCitasHoy || false;
  const citaId = location.state?.citaId || null; // Recibe citaId si está disponible
  const pacienteId = location.state?.pacienteId || null;

  useEffect(() => {
    const documentoRecibido = location.state?.documento;
    if (documentoRecibido) {
      setDocumento(documentoRecibido);
      handleSearchByDocumento(documentoRecibido); // Busca automáticamente
    }
  }, [location.state]);

  const handleChange = (e) => {
    setDocumento(e.target.value);
  };

  const handleSearchByDocumento = async (doc) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${doc}/HistoriasXDocumento`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado: verifica tu token.');
        }
        if (response.status === 404) {
          throw new Error('No se encontraron historias clínicas para este documento.');
        }
        throw new Error('Error al obtener las historias clínicas.');
      }

      const data = await response.json();

      // Ordenar historias por fecha, de más reciente a más antigua
      const historiasOrdenadas = data.sort(
        (a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
      );

      setHistorias(historiasOrdenadas);
      setStatusMessage(null);
    } catch (error) {
      setStatusMessage(error.message);
      setHistorias([]);
    }
  };

  const handleViewClick = (historia) => {
    navigate(`/consultas/${historia.id}`, { state: { historia, documento } });
  };

  const handleAddHistoriaClinica = () => {
    // Navegar a ConsultasCreate con documento y citaId
    navigate('/consultascreate', { state: { documento, citaId, pacienteId } });
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

        {historias.length > 0 && (
          <div className="relative bg-blue-50 border border-blue-200 rounded-xl overflow-y-auto max-h-[60vh]">
            <div className="sticky top-0 bg-blue-50 z-10 p-4 border-b border-blue-300 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-700">
                Historia Clínica de {historias[0].pacienteNombres} {historias[0].pacienteApellidos}
              </h3>
              {/* Botón para agregar nueva historia clínica */}
              {desdeCitasHoy && (
                <button
                  onClick={handleAddHistoriaClinica}
                  className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition-colors"
                >
                  + Agregar Consulta
                </button>
              )}
            </div>
            <ul className="list-disc pl-6">
              {historias.map((historia) => (
                <li key={historia.id} className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-bold text-lg text-blue-600">
                      ID de Consulta: {historia.id}
                    </p>
                    <p><strong>Fecha de Creación:</strong> {new Date(historia.fechaCreacion).toLocaleDateString()}</p>
                    <p><strong>Médico:</strong> {historia.nombreMedico || 'No disponible'}</p>
                    <p><strong>Número de Cita:</strong> {historia.citaId || 'No disponible'}</p>
                  </div>
                  <button
                    onClick={() => handleViewClick(historia)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ver
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoriasClinicas;
