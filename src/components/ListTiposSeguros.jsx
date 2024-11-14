import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ListTiposSeguros = () => {
    const [tiposSeguros, setTiposSeguros] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTipoSeguro, setSelectedTipoSeguro] = useState({ id: null, nombre: '', descripcion: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTiposSeguros();
    }, []);

    const fetchTiposSeguros = async () => {
        try {
            const response = await fetch("http://localhost:8081/api/TiposSeguros");
            if (response.ok) {
                const data = await response.json();
                setTiposSeguros(data);
            } else {
                setStatusMessage("Error al obtener los tipos de seguros");
            }
        } catch (error) {
            setStatusMessage("Error al conectar con el servidor");
        }
    };

    const handleEditClick = (tipoSeguro) => {
        setSelectedTipoSeguro(tipoSeguro);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (tipoSeguro) => {
        setSelectedTipoSeguro(tipoSeguro);
        setIsDeleteModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedTipoSeguro((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateClick = () => {
        navigate("/create-tiposeguro");
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/TiposSeguros/${selectedTipoSeguro.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedTipoSeguro),
            });
            if (response.ok) {
                setStatusMessage("Tipo de seguro actualizado exitosamente");
                fetchTiposSeguros();
            } else {
                setStatusMessage("Error al actualizar el tipo de seguro");
            }
        } catch (error) {
            setStatusMessage("Error al conectar con el servidor");
        }
        setIsEditModalOpen(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/TiposSeguros/${selectedTipoSeguro.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setStatusMessage("Tipo de seguro eliminado exitosamente");
                fetchTiposSeguros();
            } else {
                setStatusMessage("Error al eliminar el tipo de seguro");
            }
        } catch (error) {
            setStatusMessage("Error al conectar con el servidor");
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <div className="bg-neutral-800/70 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Listado de Tipos de Seguros</h2>
                
                {tiposSeguros.length > 0 ? (
                    <table className="min-w-full bg-neutral-700 text-white rounded-md overflow-hidden">
                        <thead>
                            <tr className="bg-neutral-600">
                                <th className="py-2 px-4 border-b border-neutral-500">Nombre</th>
                                <th className="py-2 px-4 border-b border-neutral-500">Descripción</th>
                                <th className="py-2 px-4 border-b border-neutral-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposSeguros.map((tipoSeguro) => (
                                <tr key={tipoSeguro.id} className="hover:bg-neutral-600">
                                    <td className="py-2 px-4 border-b border-neutral-500">{tipoSeguro.nombre}</td>
                                    <td className="py-2 px-4 border-b border-neutral-500">{tipoSeguro.descripcion}</td>
                                    <td className="py-2 px-4 border-b border-neutral-500 flex space-x-2">
                                        <button 
                                            onClick={() => handleEditClick(tipoSeguro)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(tipoSeguro)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !statusMessage && <p className="text-center text-gray-400">No hay tipos de seguros disponibles.</p>
                )}

                {/* Modal de edición */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full">
                            <h3 className="text-xl font-semibold text-white mb-4">Editar Tipo de Seguro</h3>
                            <input
                                type="text"
                                name="nombre"
                                value={selectedTipoSeguro.nombre}
                                onChange={handleEditChange}
                                className="w-full p-3 mb-3 border border-neutral-600 rounded-md bg-neutral-700 text-white"
                                placeholder="Nombre"
                            />
                            <input
                                type="text"
                                name="descripcion"
                                value={selectedTipoSeguro.descripcion}
                                onChange={handleEditChange}
                                className="w-full p-3 mb-3 border border-neutral-600 rounded-md bg-neutral-700 text-white"
                                placeholder="Descripción"
                            />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
                                <button onClick={handleEditSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmación de eliminación */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full">
                            <h3 className="text-xl font-semibold text-white mb-4">Eliminar Tipo de Seguro</h3>
                            <p className="text-white mb-6">¿Estás seguro de que deseas eliminar "{selectedTipoSeguro.nombre}"?</p>
                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancelar</button>
                                <button onClick={handleDeleteSubmit} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}

                {statusMessage && (
                    <p className={`mt-4 text-center ${statusMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                        {statusMessage}
                    </p>
                )}

                {/* Botón de creación */}
                <div className="flex justify-center mt-4 mb-4">
                    <button 
                        onClick={handleCreateClick} 
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md"
                    >
                        Crear Tipo Seguro
                    </button>
                </div>


                
            </div>
        </div>
    );
};

export default ListTiposSeguros;
