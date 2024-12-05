import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const RegisterMedico = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '', // Nuevo campo para confirmar la contraseña
        activo: true,
        documento: '',
        nombres: '',
        apellidos: '',
        matricula: '',
        especialidadesIds: [],
    });

    const [especialidades, setEspecialidades] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        // Fetch especialidades
        const fetchEspecialidades = async () => {
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
            } catch (error) {
                setStatusMessage(error.message);
            }
        };

        fetchEspecialidades();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (selectedOptions) => {
        const ids = selectedOptions.map((option) => option.value);
        setFormData((prevData) => ({
            ...prevData,
            especialidadesIds: ids,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setStatusMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/Auth/RegisterMedico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    confirmPassword: undefined, // No enviar el campo confirmPassword
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setStatusMessage(data.statusMessage || 'Médico registrado exitosamente');

                // Reset form
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '', // Limpiar confirmación
                    activo: true,
                    documento: '',
                    nombres: '',
                    apellidos: '',
                    matricula: '',
                    especialidadesIds: [],
                });
            } else {
                const errorData = await response.json();
                setStatusMessage(errorData.mensaje || 'Error al registrar médico');
            }
        } catch (error) {
            setStatusMessage('Error al registrar médico');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-700 to-teal-900 text-gray-800">
            <div className="bg-white shadow-2xl rounded-xl p-10 max-w-2xl w-full space-y-6">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-4">Registro de Médico</h2>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="documento"
                            placeholder="Documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="nombres"
                            placeholder="Nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="apellidos"
                            placeholder="Apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="text"
                            name="matricula"
                            placeholder="Matrícula"
                            value={formData.matricula}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar Contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Especialidades
                        </label>
                        <Select
                            isMulti
                            options={especialidades.map((esp) => ({ value: esp.id, label: esp.nombre }))}
                            className="w-full"
                            placeholder="Seleccione especialidades"
                            onChange={handleSelectChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Registrar
                    </button>
                </form>

                {statusMessage && (
                    <p
                        className={`text-center font-semibold mt-4 ${
                            statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegisterMedico;
