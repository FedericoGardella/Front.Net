import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ selectedTab, onTabClick, isAuthenticated, onLogout }) => {
  const role = localStorage.getItem('role'); // Obtén el rol del localStorage
  const nombreUsuario = localStorage.getItem('nombre'); // Obtén el nombre del usuario del localStorage

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

            {/* Opciones para No Autenticados */}
            {!isAuthenticated && (
              <Link
                to="/create-user"
                className={`text-lg ${
                  selectedTab === 'create-user' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                } hover:text-blue-600 transition-colors`}
                onClick={() => onTabClick('create-user')}
              >
                Registrarme
              </Link>
            )}

            {/* Opciones para ADMIN */}
            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Link
                  to="/register-medico"
                  className={`text-lg ${
                    selectedTab === 'register-medico' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('register-medico')}
                >
                  Registrar Médico
                </Link>
                <Link
                  to="/pacientes"
                  className={`text-lg ${
                    selectedTab === 'pacientes' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('pacientes')}
                >
                  Administrar Pacientes
                </Link>
                <Link
                  to="/medicos"
                  className={`text-lg ${
                    selectedTab === 'medicos' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('medicos')}
                >
                  Administrar Médicos
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
                <Link
                  to="/gruposcitas-create"
                  className={`text-lg ${
                    selectedTab === 'gruposcitas-create' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('gruposcitas-create')}
                >
                  Grupos de Citas
                </Link>
                <Link
                  to="/precios-especialidades"
                  className={`text-lg ${
                    selectedTab === "precios-especialidades"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick("precios-especialidades")}
                >
                  Precios Especialidades
                </Link>
                <Link
                  to="/tipos-seguros"
                  className={`text-lg ${
                    selectedTab === "tipos-seguros"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick("tipos-seguros")}
                >
                  Tipos de Seguros
                </Link>
                <Link
                  to="/contratos-seguros/create"
                  className={`text-lg ${
                    selectedTab === "contratos-seguros-create"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick("contratos-seguros-create")}
                >
                  Crear Contratos
                </Link>
                <Link
                  to="/contratos-seguros/cancel"
                  className={`text-lg ${
                    selectedTab === "contratos-seguros-cancel"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick("contratos-seguros-cancel")}
                >
                  Cancelar Contratos
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
            {isAuthenticated && role === 'PACIENTE' && (
              <>
                <Link
                  to="/modulo-consulta"
                  className={`text-lg ${
                    selectedTab === 'modulo-consulta' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('modulo-consulta')}
                >
                  Mi Última Consulta
                </Link>
                <Link
                  to="/calendariocitas"
                  className={`text-lg ${
                    selectedTab === 'calendariocitas' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('calendariocitas')}
                >
                  Grupos de Citas
                </Link>
                <Link
                  to="/facturas"
                  className={`text-lg ${
                    selectedTab === 'facturas' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  } hover:text-blue-600 transition-colors`}
                  onClick={() => onTabClick('facturas')}
                >
                  Facturas
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Autenticación */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && nombreUsuario && (
            <p className="text-lg text-gray-700 font-semibold">
              Bienvenido, {nombreUsuario}
            </p>
          )}
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
