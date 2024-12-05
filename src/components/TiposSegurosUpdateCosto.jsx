import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TiposSegurosUpdateCosto = () => {
  const { id } = useParams(); // Obtiene el id del tipo de seguro desde la URL
  const [nuevoCosto, setNuevoCosto] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/TiposSeguros/updateCosto/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoCosto),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStatusMessage(`Costo actualizado correctamente: $${data.costo}`);
        setTimeout(() => {
          navigate(-1); // Regresa a la página anterior después de un tiempo
        }, 2000);
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.mensaje || "Error al actualizar el costo.");
      }
    } catch (error) {
      setStatusMessage("Error al actualizar el costo.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Actualizar Costo</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="number"
            placeholder="Nuevo Costo"
            value={nuevoCosto}
            onChange={(e) => setNuevoCosto(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Actualizar
          </button>
        </form>

        {statusMessage && (
          <p
            className={`text-center font-semibold mt-4 ${
              statusMessage.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default TiposSegurosUpdateCosto;
