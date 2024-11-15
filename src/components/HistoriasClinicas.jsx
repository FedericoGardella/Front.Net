import React, { useState } from 'react';

const HistoriasClinicas = () => {
    const [documento, setDocumento] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleChange = (e) => {
        setDocumento(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await fetch("http://localhost:8084/api/HistoriasClinicas/MockPacientes");
            
            if (response.ok) {
                const pacientes = await response.json();
                const pacienteEncontrado = pacientes.find(p => p.documento === documento);
                
                if (pacienteEncontrado) {
                    setPaciente(pacienteEncontrado);
                    setStatusMessage(null);
                } else {
                    setPaciente(null);
                    setStatusMessage("Paciente no encontrado");
                }
            } else {
                setStatusMessage("Error al obtener los datos de pacientes");
                setPaciente(null);
            }
        } catch (error) {
            setStatusMessage("Error al buscar el paciente");
            setPaciente(null);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-white">
            <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full h-[80vh] flex flex-col justify-start text-gray-800">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Gestión de Historias Clínicas</h2>
                
                {/* Área de búsqueda colocada hacia arriba */}
                <div className="space-y-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Ingrese documento del paciente"
                            value={documento}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-700"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors"
                        >
                            Buscar
                        </button>
                    </div>

                    {statusMessage && (
                        <p className="text-center text-red-500 font-semibold">
                            {statusMessage}
                        </p>
                    )}
                </div>

                {/* Información del paciente debajo del área de búsqueda */}
                {paciente && (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl relative">
                        <h3 className="text-xl font-bold text-blue-700 mb-6">Historia Clínica de: <span className="font-normal text-gray-800">{paciente.nombres} {paciente.apellidos}</span></h3>
                        <div className="grid grid-cols-2 gap-4 text-lg">
                            <p><strong>Documento:</strong> {paciente.documento}</p>
                            <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                            <p><strong>ID Paciente:</strong> {paciente.id}</p>
                        </div>

                        <div className="absolute top-6 right-6 space-x-4 flex">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md">
                                Diagnósticos
                            </button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md">
                                Recetas
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md">
                                Estudios
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoriasClinicas;
