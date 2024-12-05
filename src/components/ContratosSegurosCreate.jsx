import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ContratosSegurosCreate = () => {
  const [pacientes, setPacientes] = useState([]);
  const [tiposSeguros, setTiposSeguros] = useState([]);
  const [formData, setFormData] = useState({
    pacienteId: "",
    tipoSeguroId: "",
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  // Cargar pacientes y tipos de seguros al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Obtener pacientes
        const pacientesResponse = await fetch("http://localhost:8082/api/Pacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const pacientesData = await pacientesResponse.json();
        setPacientes(pacientesData);

        // Obtener tipos de seguros
        const tiposSegurosResponse = await fetch("http://localhost:8081/api/TiposSeguros", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const tiposSegurosData = await tiposSegurosResponse.json();
        setTiposSeguros(tiposSegurosData);
      } catch (error) {
        setStatusMessage("Error al cargar los datos iniciales.");
      }
    };

    fetchData();
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
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/ContratosSeguros", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setStatusMessage("Contrato de seguro creado exitosamente.");
        setTimeout(() => {
          navigate(-1); // Regresa a la página anterior después de un tiempo
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.mensaje || "Error al crear el contrato de seguro.");
      }
    } catch (error) {
      setStatusMessage("Error al crear el contrato de seguro.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Crear Contrato de Seguro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Selección de Paciente */}
            <select
              name="pacienteId"
              value={formData.pacienteId}
              onChange={handleChange}
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

            {/* Selección de Tipo de Seguro */}
            <select
              name="tipoSeguroId"
              value={formData.tipoSeguroId}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            >
              <option value="">Seleccione un Tipo de Seguro</option>
              {tiposSeguros.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Contrato
          </button>
        </form>

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

export default ContratosSegurosCreate;
