import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PreciosEspecialidadesList = () => {
  const [preciosEspecialidades, setPreciosEspecialidades] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreciosEspecialidades = async () => {
      try {
        const token = localStorage.getItem("token"); // Usa el token almacenado
        const response = await fetch("http://localhost:8081/api/PreciosEspecialidades", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al obtener los precios especiales.");
        }

        const data = await response.json();
        setPreciosEspecialidades(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchPreciosEspecialidades();
  }, []);

  const handleUpdateCosto = (id) => {
    navigate(`/update-costo/${id}`); // Redirige al componente de actualización de costo
  };

  const handleCreate = () => {
    navigate("/precios-especialidades/create");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">
          Listado de Precios Especialidades
        </h2>
  
        {errorMessage && (
          <div className="text-red-500 text-center font-semibold mb-4">
            {errorMessage}
          </div>
        )}
  
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="border p-4">Especialidad</th>
                <th className="border p-4">Tipo Seguro</th>
                <th className="border p-4">Costo</th>
                <th className="border p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preciosEspecialidades.length > 0 ? (
                preciosEspecialidades.map((precio) => (
                  <tr key={precio.id} className="text-center hover:bg-blue-50">
                    <td className="border p-4">{precio.especialidadNombre}</td>
                    <td className="border p-4">{precio.tipoSeguroNombre}</td>
                    <td className="border p-4">${precio.costo.toFixed(2)}</td>
                    <td className="border p-4">
                      <button
                        onClick={() => handleUpdateCosto(precio.id)}
                        className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                      >
                        Actualizar Costo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No se encontraron precios especialidades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botón para agregar un nuevo precio especialidad */}
        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Agregar Precio Especialidad
          </button>
        </div>

      </div>
    </div>
  );
  
};

export default PreciosEspecialidadesList;
