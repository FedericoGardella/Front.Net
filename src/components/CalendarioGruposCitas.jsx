import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CalendarioGruposCitas = () => {
  const [mesActual, setMesActual] = useState(new Date().getMonth()); // Índice del mes actual
  const [diasMes, setDiasMes] = useState([]);
  const [gruposCitas, setGruposCitas] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  // Obtener los días del mes seleccionado
  const obtenerDiasMes = (mes, anio) => {
    const dias = [];
    const diasEnMes = new Date(anio, mes + 1, 0).getDate(); // Días en el mes
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }
    return dias;
  };

  // Cargar especialidades desde el endpoint
  const cargarEspecialidades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/Especialidades', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las especialidades.');
      }

      const data = await response.json();
      setEspecialidades(data);
      if (data.length > 0) {
        setEspecialidadId(data[0].id.toString()); // Seleccionar la primera especialidad por defecto
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Cargar grupos de citas para un mes y especialidad específicos
  const cargarGruposCitas = async (mes) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const anio = new Date().getFullYear();
      const response = await fetch(
        `http://localhost:8083/api/GruposCitas/especialidad/${especialidadId}/mes/${mes + 1}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener los grupos de citas.');
      }

      const data = await response.json();
      setGruposCitas(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  useEffect(() => {
    if (especialidadId) {
      const anio = new Date().getFullYear();
      const dias = obtenerDiasMes(mesSeleccionado, anio);
      setDiasMes(dias);
      cargarGruposCitas(mesSeleccionado);
    }
  }, [mesSeleccionado, especialidadId]);

  const verificarCitasPorDia = (dia) => {
    return gruposCitas.some((grupo) => new Date(grupo.fecha).getDate() === dia);
  };

  const handleDiaClick = (dia) => {
    const grupoCita = gruposCitas.find(
      (grupo) => new Date(grupo.fecha).getDate() === dia
    );
    if (grupoCita) {
      navigate(`/grupos-citas/${grupoCita.id}`, { state: { especialidadId } });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Calendario de Grupos de Citas
        </h2>
        {error && (
          <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
        )}

        {/* Select para elegir la especialidad */}
        {especialidades.length > 0 && (
          <div className="space-y-4 text-center">
            <select
              value={especialidadId}
              onChange={(e) => setEspecialidadId(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
            >
              {especialidades.map((especialidad) => (
                <option key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Calendario solo si hay una especialidad seleccionada */}
        {especialidadId && (
          <>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {meses
                .slice(mesActual)
                .concat(meses.slice(0, mesActual))
                .map((mes, index) => (
                  <button
                    key={mes}
                    onClick={() => setMesSeleccionado((mesActual + index) % 12)}
                    className={`py-3 px-6 rounded-lg shadow-md ${
                      mesSeleccionado === (mesActual + index) % 12
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    } hover:bg-green-700 hover:text-white transition-colors`}
                  >
                    {mes}
                  </button>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-6">
              {diasMes.map((dia) => {
                const tieneCitas = verificarCitasPorDia(dia);
                return (
                  <div
                    key={dia}
                    className={`text-center py-3 rounded-lg font-semibold cursor-pointer ${
                      tieneCitas
                        ? 'bg-green-500 text-white hover:bg-green-700'
                        : 'bg-red-500 text-white cursor-not-allowed'
                    }`}
                    onClick={() => tieneCitas && handleDiaClick(dia)}
                  >
                    {dia}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarioGruposCitas;
