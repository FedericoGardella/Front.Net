import React, { useState } from 'react';

const CreateTipoSeguro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        cobertura: '',
        costoMensual: '',
    });

    const [statusMessage, setStatusMessage] = useState(null);

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
            const response = await fetch("http://localhost:8081/api/TiposSeguros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const data = await response.json();
                setStatusMessage("Tipo de Seguro creado exitosamente");
                
                // Limpiar los campos si el registro fue exitoso
                setFormData({
                    nombre: '',
                    descripcion: '',
                });
            } else {
                const errorData = await response.json();
                setStatusMessage(errorData.mensaje || "Error al crear el tipo de seguro");
            }
        } catch (error) {
            setStatusMessage("Error al crear el tipo de seguro");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <div className="bg-neutral-800/70 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Crear Tipo de Seguro</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del Seguro"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="text"
                        name="descripcion"
                        placeholder="Descripción"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Crear Tipo de Seguro
                    </button>
                </form>

                {statusMessage && (
                    <p className={`mt-4 text-center ${statusMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreateTipoSeguro;
