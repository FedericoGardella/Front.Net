import React, { useState, useEffect } from "react";

const PreciosEspecialidadesCreate = () => {

  const [formData, setFormData] = useState({
    especialidadId: "",
    tipoSeguroId: "",
    costo: "",
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [tiposSeguros, setTiposSeguros] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    // Fetch especialidades y tipos de seguros al cargar el componente
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/Especialidades", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener las especialidades");
        }
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTiposSeguros = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/TiposSeguros", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de seguros");
        }
        const data = await response.json();
        setTiposSeguros(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEspecialidades();
    fetchTiposSeguros();
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
      const response = await fetch("http://localhost:8081/api/PreciosEspecialidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          especialidadId: formData.especialidadId,
          tipoSeguroId: formData.tipoSeguroId,
          costo: parseFloat(formData.costo),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al crear el precio de especialidad");
      }

      setStatusMessage("Precio de especialidad creado exitosamente");
      setFormData({
        especialidadId: "",
        tipoSeguroId: "",
        costo: "",
      });
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-blue-800 font-bold text-xl hover:underline"
          >
            ← Volver
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800">Crear Precio Especialidad</h2>
        </div>

        {statusMessage && (
          <p
            className={`text-center font-semibold mb-4 ${
              statusMessage.includes("Error") || statusMessage.includes("Ya existe")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {statusMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="especialidadId" className="block font-medium text-gray-700">
                Especialidad
              </label>
              <select
                name="especialidadId"
                value={formData.especialidadId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((especialidad) => (
                  <option key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tipoSeguroId" className="block font-medium text-gray-700">
                Tipo de Seguro
              </label>
              <select
                name="tipoSeguroId"
                value={formData.tipoSeguroId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
              >
                <option value="">Seleccione un tipo de seguro</option>
                {tiposSeguros.map((tipoSeguro) => (
                  <option key={tipoSeguro.id} value={tipoSeguro.id}>
                    {tipoSeguro.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="costo" className="block font-medium text-gray-700">
                Costo
              </label>
              <input
                type="number"
                name="costo"
                placeholder="Ingrese el costo"
                value={formData.costo}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
};

export default PreciosEspecialidadesCreate;
