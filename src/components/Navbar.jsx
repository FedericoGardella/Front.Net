import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ selectedTab, onTabClick, isAuthenticated, onLogout }) => {
  const role = localStorage.getItem('role'); // Obtén el rol del localStorage
  const nombreUsuario = localStorage.getItem('nombre'); // Obtén el nombre del usuario del localStorage
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

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
              <div className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="text-sm text-gray-700 hover:text-blue-600 font-semibold px-2 py-1 flex items-center"
                >
                  Admin Menu
                  <svg
                    className={`w-4 h-4 ml-2 transform ${
                      isAdminMenuOpen ? 'rotate-180' : ''
                    } transition-transform`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute bg-white shadow-md rounded-md mt-2 z-10">
                    <Link
                      to="/register-medico"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('register-medico');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Registrar Médico
                    </Link>
                    <Link
                      to="/pacientes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('pacientes');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Administrar Pacientes
                    </Link>
                    <Link
                      to="/medicos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('medicos');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Administrar Médicos
                    </Link>
                    <Link
                      to="/medicamentos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('medicamentos');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Medicamentos
                    </Link>
                    <Link
                      to="/gruposcitas-create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('gruposcitas-create');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Grupos de Citas
                    </Link>
                    <Link
                      to="/precios-especialidades"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('precios-especialidades');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Precios Especialidades
                    </Link>
                    <Link
                      to="/tipos-seguros"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('tipos-seguros');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Tipos de Seguros
                    </Link>
                    <Link
                      to="/contratos-seguros/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('contratos-seguros-create');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Crear Contratos
                    </Link>
                    <Link
                      to="/contratos-seguros/cancel"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                      onClick={() => {
                        onTabClick('contratos-seguros-cancel');
                        setIsAdminMenuOpen(false);
                      }}
                    >
                      Cancelar Contratos
                    </Link>
                  </div>
                )}
              </div>
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
                  Calendario
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
