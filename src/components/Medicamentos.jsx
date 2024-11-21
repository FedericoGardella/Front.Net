import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Medicamentos = () => {
  const navigate = useNavigate();
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState(null);
  const [newMedicamento, setNewMedicamento] = useState({ nombre: '', dosis: '' });
  const [editing, setEditing] = useState(null);

  const fetchMedicamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Medicamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los medicamentos');
      }

      const data = await response.json();
      setMedicamentos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAdd = async () => {
    if (!newMedicamento.nombre || !newMedicamento.dosis) {
      setError('Ambos campos (Nombre y Dosis) son obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Medicamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMedicamento),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el medicamento');
      }

      await fetchMedicamentos();
      setNewMedicamento({ nombre: '', dosis: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = async (id) => {
    if (!editing.nombre || !editing.dosis) {
      setError('Ambos campos (Nombre y Dosis) son obligatorios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Medicamentos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editing),
      });

      if (!response.ok) {
        throw new Error('Error al editar el medicamento');
      }

      await fetchMedicamentos();
      setEditing(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Medicamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el medicamento');
      }

      await fetchMedicamentos();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBack = () => {
    navigate('/historiasclinicas');
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBack}
            className="text-blue-800 font-bold text-xl hover:underline"
          >
            ← Volver
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-800">Gestión de Medicamentos</h2>
        </div>

        {error && <p className="text-center text-red-500 font-semibold mb-4">{error}</p>}

        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Agregar Nuevo Medicamento</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Nombre"
              value={newMedicamento.nombre}
              onChange={(e) => setNewMedicamento({ ...newMedicamento, nombre: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
            />
            <input
              type="text"
              placeholder="Dosis"
              value={newMedicamento.dosis}
              onChange={(e) => setNewMedicamento({ ...newMedicamento, dosis: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto">
          {medicamentos.map((medicamento) => (
            <div key={medicamento.id} className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
              {editing?.id === medicamento.id ? (
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={editing.nombre}
                    onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                  />
                  <input
                    type="text"
                    value={editing.dosis}
                    onChange={(e) => setEditing({ ...editing, dosis: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                  />
                  <button
                    onClick={() => handleEdit(medicamento.id)}
                    className="bg-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-red-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-800 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-bold text-blue-700 mb-2">{medicamento.nombre}</p>
                    <p className="text-lg"><strong>Dosis:</strong> {medicamento.dosis}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setEditing(medicamento)}
                      className="bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(medicamento.id)}
                      className="bg-red-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-800 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Medicamentos;
