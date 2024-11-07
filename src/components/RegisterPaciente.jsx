import React, { useState } from 'react';

const RegisterPaciente = () => {
    const [formData, setFormData] = useState({
        documento: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        activo: true,
        password: '',
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
            const response = await fetch("http://localhost:8082/api/Auth/RegisterPaciente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const data = await response.json();
                setStatusMessage(data.statusMessage || "Usuario registrado exitosamente");
                
                // Limpiar los campos si el registro fue exitoso
                setFormData({
                    documento: '',
                    nombres: '',
                    apellidos: '',
                    telefono: '',
                    email: '',
                    activo: true,
                    password: '',
                });
            } else {
                const errorData = await response.json();
                setStatusMessage(errorData.mensaje || "Error al registrar usuario");
            }
        } catch (error) {
            setStatusMessage("Error al registrar usuario");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <div className="bg-neutral-800/70 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Registro de Paciente</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <input
                        type="text"
                        name="documento"
                        placeholder="Documento"
                        value={formData.documento}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="text"
                        name="nombres"
                        placeholder="Nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        autoComplete="off"
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                        className="w-full p-3 border border-neutral-600 rounded-md focus:outline-none focus:border-blue-500 bg-neutral-700 text-white placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Registrar
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

export default RegisterPaciente;
