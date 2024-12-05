import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FacturasPaciente = () => {
  const [facturas, setFacturas] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { pacienteId } = useParams(); // ID del paciente desde la URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        // Si el usuario no es ADMIN y está intentando acceder a las facturas de otro paciente
        if (role !== "ADMIN" && pacienteId && pacienteId !== localStorage.getItem("idUsuario")) {
            navigate("/"); // Redirigir al inicio o a una página de error
            return;
        }

        // Si el usuario es un paciente, usamos su propio ID almacenado
        const id = role === "PACIENTE" ? localStorage.getItem("idUsuario") : pacienteId;

        

        const response = await fetch(
          `http://localhost:8081/api/Facturas/mensuales?pacienteId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || "Error al obtener las facturas.");
        }

        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchFacturas();
  }, [pacienteId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">
          Facturas Mensuales Sin Pagar
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
                <th className="border p-4">Fecha</th>
                <th className="border p-4">Costo</th>
                <th className="border p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {facturas.length > 0 ? (
                facturas.map((factura) => (
                  <tr key={factura.id} className="text-center hover:bg-blue-50">
                    <td className="border p-4">
                      {new Date(factura.fecha).toLocaleDateString()}
                    </td>
                    <td className="border p-4">${factura.costo.toFixed(2)}</td>
                    <td className="border p-4">
                      {factura.pago ? "Pagada" : "Pendiente"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    No se encontraron facturas mensuales pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacturasPaciente;
