// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ selectedTab, onTabClick, isAuthenticated, onLogout }) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-primary">
          Inicio
        </Link>
        {isAuthenticated && (
          <Link to="/create-user" className="btn btn-primary ml-4">
            Registrar Paciente
          </Link>
        )}
      </div>
      <div className="flex-none">
        {isAuthenticated ? (
          <button onClick={onLogout} className="btn btn-ghost">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
