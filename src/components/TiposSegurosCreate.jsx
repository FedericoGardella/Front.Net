import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TiposSegurosCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    costo: 0,
  });
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "costo" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/TiposSeguros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al guardar el tipo de seguro.");
      }

      const data = await response.json();
      setStatusMessage({
        type: "success",
        message: "Tipo de seguro creado exitosamente.",
      });

      // Redirigir a la lista de tipos de seguro después de un breve retraso
      setTimeout(() => navigate("/tipos-seguros"), 2000);
    } catch (error) {
      setStatusMessage({ type: "error", message: error.message });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Crear Tipo de Seguro</h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
            <input
              type="number"
              name="costo"
              placeholder="Costo"
              value={formData.costo}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Tipo de Seguro
          </button>
        </form>

        {statusMessage && (
          <p
            className={`text-center font-semibold mt-4 ${
              statusMessage.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {statusMessage.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TiposSegurosCreate;
