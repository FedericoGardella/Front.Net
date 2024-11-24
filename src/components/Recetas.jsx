import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Recetas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [recetaToDelete, setRecetaToDelete] = useState(null);

  const documento = location.state?.documento;
  const historiaClinica = location.state?.historiaClinica;

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8084/api/HistoriasClinicas/${id}/Recetas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setRecetas([]);
        } else if (!response.ok) {
          throw new Error('Ocurrió un error al obtener las recetas.');
        } else {
          const data = await response.json();
          setRecetas(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, [id]);

  const handleBack = () => {
    navigate(`/consultas/${id}`, { state: { historia: historiaClinica, documento } });
  };

  const handleCreate = () => {
    navigate(`/recetas/${id}/create`, { state: { historiaClinicaId: id, documento } });
  };

  const confirmDelete = (recetaId) => {
    setRecetaToDelete(recetaId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Recetas/${recetaToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la receta.');
      }

      // Eliminar receta de la lista local
      setRecetas((prev) => prev.filter((receta) => receta.id !== recetaToDelete));
      setShowModal(false);
      setRecetaToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 font-semibold">Cargando recetas...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-700 to-purple-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-indigo-800 font-bold text-xl hover:underline"
          >
            ← Volver
          </button>
          <h2 className="text-3xl font-bold text-center text-indigo-800">{`Recetas de la consulta n. ${historiaClinica?.id || id}`}</h2>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md"
          >
            + Nueva Receta
          </button>
        </div>

        {error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : recetas.length === 0 ? (
          <p className="text-center text-gray-600 font-semibold">
            No se encontraron recetas para esta consulta. Puede agregar una nueva receta haciendo clic en el botón "Nueva Receta".
          </p>
        ) : (
          <div className="space-y-6 overflow-y-auto">
            {recetas.map((receta) => (
              <div key={receta.id} className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-indigo-700 mb-2">Receta ID: {receta.id}</p>
                  <p className="text-lg"><strong>Descripción:</strong> {receta.descripcion}</p>
                  <p className="text-lg"><strong>Fecha:</strong> {new Date(receta.fecha).toLocaleDateString()}</p>
                  <p className="text-lg"><strong>Tipo:</strong> {receta.tipo}</p>
                </div>
                <button
                  onClick={() => confirmDelete(receta.id)}
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
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Estás seguro de que deseas eliminar esta receta?</h3>
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

export default Recetas;
