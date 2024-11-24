import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Diagnosticos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [diagnosticoToDelete, setDiagnosticoToDelete] = useState(null);

  const documento = location.state?.documento;
  const historiaClinica = location.state?.historiaClinica;

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/Diagnosticos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setDiagnosticos([]);
        } else if (!response.ok) {
          throw new Error('Ocurrió un error al obtener los diagnósticos.');
        } else {
          const data = await response.json();
          setDiagnosticos(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDiagnosticos();
    }
  }, [id]);

  const handleBack = () => {
    if (historiaClinica) {
      navigate(`/consultas/${historiaClinica.id}`, { state: { historia: historiaClinica, documento } });
    } else {
      setError('No se puede volver porque falta información de la consulta.');
    }
  };

  const handleCreate = () => {
    navigate(`/diagnosticos/${id}/create`, { state: { documento, historiaClinica } });
  };

  const confirmDelete = (diagnosticoId) => {
    setDiagnosticoToDelete(diagnosticoId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Diagnosticos/${diagnosticoToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el diagnóstico.');
      }

      // Eliminar diagnóstico de la lista
      setDiagnosticos((prev) => prev.filter((diag) => diag.id !== diagnosticoToDelete));
      setShowModal(false);
      setDiagnosticoToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 font-semibold">Cargando diagnósticos...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-800 font-bold text-xl hover:underline"
          >
            <span className="mr-2">←</span>
            <span>Volver</span>
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800">{`Diagnósticos de la consulta n. ${historiaClinica?.id || id}`}</h2>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            + Nuevo Diagnóstico
          </button>
        </div>

        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : diagnosticos.length === 0 ? (
          <p className="text-center text-gray-600 font-semibold">
            No se encontraron diagnósticos para esta consulta. Puede agregar uno nuevo haciendo clic en el botón "Nuevo Diagnóstico".
          </p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {diagnosticos.map((diag) => (
              <div key={diag.id} className="p-6 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-blue-700 mb-2">Diagnóstico ID: {diag.id}</p>
                  <p className="text-lg"><strong>Descripción:</strong> {diag.descripcion}</p>
                  <p className="text-lg"><strong>Fecha:</strong> {new Date(diag.fecha).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => confirmDelete(diag.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Estás seguro de que deseas eliminar este diagnóstico?</h3>
            <div className="flex justify-around">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagnosticos;
