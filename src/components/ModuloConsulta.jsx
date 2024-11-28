import React, { useEffect, useState } from "react";

const ModuloConsulta = () => {
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUltimaHistoriaClinica = async () => {
      try {
        setLoading(true);
        const pacienteId = localStorage.getItem("idUsuario"); // ID del paciente desde localStorage
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8085/api/PortalPaciente/Pacientes/${pacienteId}/UltimaHistoriaClinica/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener la última historia clínica.");
        }

        const data = await response.json();
        setHistoriaClinica(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUltimaHistoriaClinica();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-600 font-semibold">
        Cargando información de la consulta...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-semibold">{error}</p>
    );
  }

  if (!historiaClinica) {
    return (
      <p className="text-center text-gray-600 font-semibold">
        No se encontró información de la última consulta.
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-blue-900 text-white">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-6xl w-full text-gray-800">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Última Consulta
        </h2>

        {/* Información Básica */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-lg font-semibold text-gray-700">
                <strong>ID Consulta:</strong> {historiaClinica.id}
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <strong>Fecha:</strong>{" "}
                {new Date(historiaClinica.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                <strong>Médico:</strong>{" "}
                {historiaClinica.nombreMedico || "No disponible"}
              </p>
              <p className="text-lg font-semibold text-gray-700">
                <strong>ID Cita:</strong> {historiaClinica.citaId}
              </p>
            </div>
          </div>

          {/* Comentarios */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Comentarios</h3>
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {historiaClinica.comentarios || "No hay comentarios disponibles."}
            </p>
          </div>

          {/* Resultados de Estudios */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Resultados de Estudios
            </h3>
            {historiaClinica.resultadosEstudios &&
            historiaClinica.resultadosEstudios.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-inner space-y-3 max-h-40 overflow-y-auto">
                {historiaClinica.resultadosEstudios.map((resultado) => (
                  <p key={resultado.id} className="text-lg text-gray-700">
                    <strong>ID:</strong> {resultado.id},{" "}
                    <strong>Descripción:</strong> {resultado.descripcion},{" "}
                    <strong>Fecha:</strong>{" "}
                    {new Date(resultado.fecha).toLocaleDateString()}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-700">
                No se encontraron resultados de estudios.
              </p>
            )}
          </div>

          {/* Diagnósticos */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Diagnósticos</h3>
            {historiaClinica.diagnosticos &&
            historiaClinica.diagnosticos.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-inner space-y-3 max-h-40 overflow-y-auto">
                {historiaClinica.diagnosticos.map((diagnostico) => (
                  <p key={diagnostico.id} className="text-lg text-gray-700">
                    <strong>ID:</strong> {diagnostico.id},{" "}
                    <strong>Descripción:</strong> {diagnostico.descripcion},{" "}
                    <strong>Fecha:</strong>{" "}
                    {new Date(diagnostico.fecha).toLocaleDateString()}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-700">
                No se encontraron diagnósticos.
              </p>
            )}
          </div>

          {/* Recetas */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Recetas</h3>
            {historiaClinica.recetas && historiaClinica.recetas.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-inner space-y-3 max-h-40 overflow-y-auto">
                {historiaClinica.recetas.map((receta) => (
                  <div key={receta.id} className="border-b border-gray-300 pb-2">
                    <p className="text-lg text-gray-700">
                      <strong>ID:</strong> {receta.id},{" "}
                      <strong>Descripción:</strong> {receta.descripcion},{" "}
                      <strong>Tipo:</strong> {receta.tipo},{" "}
                      <strong>Fecha:</strong>{" "}
                      {new Date(receta.fecha).toLocaleDateString()}
                    </p>
                    {/* Medicamentos */}
                    <div className="ml-4 mt-2 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Medicamentos
                      </h4>
                      {receta.medicamentos.map((medicamento) => (
                        <p key={medicamento.id} className="text-gray-700">
                          <strong>Nombre:</strong> {medicamento.nombre},{" "}
                          <strong>Dosis:</strong> {medicamento.dosis}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-700">No se encontraron recetas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuloConsulta;
