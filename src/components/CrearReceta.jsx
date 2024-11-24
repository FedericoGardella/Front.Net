import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Select from 'react-select';

const CrearReceta = () => {
  const { id } = useParams(); // Obtiene el id de la consulta desde la URL
  const navigate = useNavigate();
  const location = useLocation();

  const documento = location.state?.documento; // Obtenemos el documento del paciente
  const historiaClinica = location.state?.historiaClinica; // Obtenemos la historia clínica

  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [medicamentoIds, setMedicamentoIds] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          throw new Error('Error al obtener los medicamentos.');
        }

        const data = await response.json();
        setMedicamentos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMedicamentos();
  }, []);

  const handleSave = async () => {
    if (!descripcion.trim() || !tipo.trim() || medicamentoIds.length === 0) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const nuevaReceta = {
      fecha: new Date().toISOString(),
      descripcion,
      tipo,
      historiaClinicaId: Number(id), // Usa el id de la URL
      medicamentoIds,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8084/api/Recetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaReceta),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la receta.');
      }

      // Navegamos de regreso a Recetas con los estados necesarios
      navigate(`/recetas/${id}`, { state: { documento, historiaClinica } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    // Navegamos de regreso a Recetas con los estados necesarios
    navigate(`/recetas/${id}`, { state: { documento, historiaClinica } });
  };

  const handleSelectChange = (selectedOptions) => {
    const ids = selectedOptions.map((option) => option.value);
    setMedicamentoIds(ids);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-700 to-indigo-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full flex flex-col">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-8">Crear Nueva Receta</h2>
        {error && <p className="text-center text-red-500 font-semibold mb-4">{error}</p>}

        <textarea
          placeholder="Descripción de la receta"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-gray-100 text-gray-700 mb-6"
        />

        <input
          type="text"
          placeholder="Tipo de receta"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-gray-100 text-gray-700 mb-6"
        />

        <Select
          isMulti
          options={medicamentos.map((med) => ({ value: med.id, label: med.nombre }))}
          className="mb-6"
          placeholder="Seleccione medicamentos"
          onChange={handleSelectChange}
        />

        <div className="flex justify-between">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearReceta;
