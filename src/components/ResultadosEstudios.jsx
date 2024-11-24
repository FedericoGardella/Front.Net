import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ResultadosEstudios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resultadoToDelete, setResultadoToDelete] = useState(null);

  const documento = location.state?.documento;
  const historiaClinica = location.state?.historiaClinica;

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/ResultadoEstudios`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setResultados([]);
        } else if (!response.ok) {
          throw new Error('Ocurrió un error al obtener los resultados de estudios.');
        } else {
          const data = await response.json();
          setResultados(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [id]);

  const handleBack = () => {
    if (historiaClinica) {
      navigate(`/consultas/${id}`, { state: { historia: historiaClinica, documento } });
    } else {
      setError('No se puede volver porque falta información de la consulta.');
    }
  };

  const handleCreate = () => {
    navigate(`/resultadosestudios/${id}/create`, { state: { documento, historiaClinica } });
  };

  const confirmDelete = (resultadoId) => {
    setResultadoToDelete(resultadoId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/ResultadosEstudios/${resultadoToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el resultado de estudio.');
      }

      // Eliminar resultado de la lista local
      setResultados((prev) => prev.filter((resultado) => resultado.id !== resultadoToDelete));
      setShowModal(false);
      setResultadoToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 font-semibold">Cargando resultados de estudios...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-green-800 font-bold text-xl hover:underline"
          >
            <span className="mr-2">←</span>
            <span>Volver</span>
          </button>
          <h2 className="text-2xl font-bold text-center text-green-800">{`Resultados de estudios de la consulta n. ${historiaClinica?.id || id}`}</h2>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md"
          >
            + Nuevo Resultado
          </button>
        </div>

        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : resultados.length === 0 ? (
          <p className="text-center text-gray-600 font-semibold">
            No se encontraron resultados de estudios para esta consulta. Puede agregar uno nuevo haciendo clic en el botón "Nuevo Resultado".
          </p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {resultados.map((resultado) => (
              <div key={resultado.id} className="p-6 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-green-700 mb-2">Resultado ID: {resultado.id}</p>
                  <p className="text-lg"><strong>Descripción:</strong> {resultado.descripcion}</p>
                  <p className="text-lg"><strong>Fecha:</strong> {new Date(resultado.fecha).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => confirmDelete(resultado.id)}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Estás seguro de que deseas eliminar este resultado de estudio?</h3>
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

export default ResultadosEstudios;
