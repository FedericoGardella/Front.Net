import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ selectedTab, onTabClick, isAuthenticated, onLogout }) => {
  const role = localStorage.getItem('role'); // Obtén el rol del localStorage

  return (
    <nav className="bg-white shadow-md px-8 py-4">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo / Inicio */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors"
          >
            Consultorio
          </Link>

          {/* Navegación de Pestañas */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`text-lg ${
                selectedTab === 'inicio' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition-colors`}
              onClick={() => onTabClick('inicio')}
            >
              Inicio
            </Link>
            {/* Opciones para ADMIN */}
            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Link
                  to="/create-user"
                  className={`text-lg ${
                    selectedTab === 'create-user' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('create-user')}
                >
                  Registrar Paciente
                </Link>
                <Link
                  to="/medicamentos"
                  className={`text-lg ${
                    selectedTab === 'medicamentos' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('medicamentos')}
                >
                  Medicamentos
                </Link>
              </>
            )}
            {/* Opciones para MEDICO */}
            {isAuthenticated && role === 'MEDICO' && (
              <>
                <Link
                  to="/historiasclinicas"
                  className={`text-lg ${
                    selectedTab === 'historiasclinicas' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('historiasclinicas')}
                >
                  Historias Clínicas
                </Link>
                <Link
                  to="/citashoy"
                  className={`text-lg ${
                    selectedTab === 'citas-hoy' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('citas-hoy')}
                >
                  Citas de Hoy
                </Link>
              </>
            )}

            {/* Opciones para PACIENTE */}
            {isAuthenticated && role === "PACIENTE" && (
              <Link
                to="/modulo-consulta"
                className={`text-lg ${
                  selectedTab === "modulo-consulta"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                } hover:text-blue-600 transition-colors`}
                onClick={() => onTabClick("modulo-consulta")}
              >
                Mi Última Consulta
              </Link>
            )}
          </div>
        </div>

        {/* Autenticación */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="text-lg text-gray-700 hover:text-red-600 font-semibold transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-lg text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
