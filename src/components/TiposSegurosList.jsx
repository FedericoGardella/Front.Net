import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const TiposSegurosList = () => {
  const [tiposSeguros, setTiposSeguros] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiposSeguros = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8081/api/TiposSeguros", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al obtener los tipos de seguro.");
        }

        const data = await response.json();
        setTiposSeguros(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchTiposSeguros();
  }, []);

  const handleUpdateCosto = (id) => {
    navigate(`/tipos-seguros/update-costo/${id}`);
  };

  const handleCreate = () => {
    navigate("/tipos-seguros/create");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Tipos de Seguro</h2>
  
        {errorMessage && (
          <div className="text-red-500 text-center font-semibold mb-4">
            {errorMessage}
          </div>
        )}
  
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="border p-4">Nombre</th>
                <th className="border p-4">Descripción</th>
                <th className="border p-4">Costo</th>
                <th className="border p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposSeguros.length > 0 ? (
                tiposSeguros.map((tipo) => (
                  <tr key={tipo.id} className="text-center hover:bg-blue-50">
                    <td className="border p-4">{tipo.nombre}</td>
                    <td className="border p-4">{tipo.descripcion}</td>
                    <td className="border p-4">${tipo.costo.toFixed(2)}</td>
                    <td className="border p-4 space-x-2">
                      <button
                        onClick={() => handleUpdateCosto(tipo.id)}
                        className="bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Actualizar Costo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No se encontraron tipos de seguro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Botón para agregar un nuevo tipo de seguro */}
        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Agregar Tipo de Seguro
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default TiposSegurosList;
