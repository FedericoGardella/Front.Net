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
        confirmPassword: '', // Campo adicional para confirmar la contraseña
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

        // Verificar si las contraseñas coinciden
        if (formData.password !== formData.confirmPassword) {
            setStatusMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8082/api/Auth/RegisterPaciente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    confirmPassword: undefined, // No enviar el campo confirmPassword
                }),
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
                    confirmPassword: '',
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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-700 to-blue-900 text-gray-800">
            <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">Registro de Paciente</h2>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="documento"
                            placeholder="Documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="nombres"
                            placeholder="Nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar Contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Registrar
                    </button>
                </form>

                {statusMessage && (
                    <p
                        className={`text-center font-semibold mt-4 ${
                            statusMessage.includes("Error") ? "text-red-500" : "text-green-500"
                        }`}
                    >
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterPaciente;
