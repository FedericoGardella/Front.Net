import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContratosSegurosCancel = () => {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  // Cargar pacientes al montar el componente
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8082/api/Pacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPacientes(data);
        } else {
          throw new Error("Error al cargar la lista de pacientes.");
        }
      } catch (error) {
        setStatusMessage(error.message);
      }
    };

    fetchPacientes();
  }, []);

  const handleDesactivar = async () => {
    if (!selectedPaciente) {
      setStatusMessage("Por favor, seleccione un paciente.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/ContratosSeguros/desactivar/${selectedPaciente}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStatusMessage("Contrato desactivado exitosamente.");
        setTimeout(() => {
          navigate(-1); // Regresa a la página anterior
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.mensaje || "Error al desactivar el contrato.");
      }
    } catch (error) {
      setStatusMessage("Error al desactivar el contrato.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Cancelar Contrato de Seguro</h2>

        <div className="space-y-4">
          {/* Selección de Paciente */}
          <select
            value={selectedPaciente}
            onChange={(e) => setSelectedPaciente(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
          >
            <option value="">Seleccione un Paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombres} {paciente.apellidos}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDesactivar}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancelar Contrato
        </button>

        {statusMessage && (
          <p
            className={`text-center font-semibold mb-4 ${
              statusMessage.includes("Error") || statusMessage.includes("El paciente")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContratosSegurosCancel;
