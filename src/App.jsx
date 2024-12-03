import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPaciente from './components/RegisterPaciente';
import Login from './components/Login';
import Home from './components/Home';
import HistoriasClinicas from './components/HistoriasClinicas';
import Diagnosticos from './components/Diagnosticos';
import ResultadosEstudios from './components/ResultadosEstudios';
import Medicamentos from './components/Medicamentos';
import Recetas from './components/Recetas';
import CrearDiagnostico from './components/CrearDiagnostico';
import CrearResultadoEstudio from './components/CrearResultadoEstudio';
import CitasHoy from './components/CitasHoy';
import ConsultaDetail from './components/ConsultaDetail';
import ConsultaCreate from './components/ConsultaCreate';
import CrearReceta from './components/CrearReceta';
import ModuloConsulta from './components/ModuloConsulta';
import GruposCitasCreate from './components/GruposCitasCreate';
import CalendarioGruposCitas from './components/CalendarioGruposCitas';
import DetalleGrupoCitas from './components/DetalleGrupoCitas';
import PacientesList from './components/PacientesList';

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [selectedTab, setSelectedTab] = useState('Location1');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleTabClick = (tab) => setSelectedTab(tab);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="overflow-x-hidden h-screen flex flex-col">
        <div className="flex-grow bg-gradient-to-r from-cyan-700 to-blue-900">
          <Navbar
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Home />} />
            <Route path="/create-user" element={<PrivateRoute isAuthenticated={isAuthenticated}><RegisterPaciente /></PrivateRoute>} />
            <Route path="/historiasclinicas" element={<PrivateRoute isAuthenticated={isAuthenticated}><HistoriasClinicas /></PrivateRoute>} />
            <Route path="/diagnosticos/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><Diagnosticos /></PrivateRoute>} />
            <Route path="/resultadosestudios/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ResultadosEstudios /></PrivateRoute>} />
            <Route path="/medicamentos" element={<PrivateRoute isAuthenticated={isAuthenticated}><Medicamentos /></PrivateRoute>} />
            <Route path="/recetas/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><Recetas /></PrivateRoute>} />
            <Route path="/diagnosticos/:id/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CrearDiagnostico /></PrivateRoute>} />
            <Route path="/resultadosestudios/:id/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CrearResultadoEstudio /></PrivateRoute>} />
            <Route path="/recetas/:id/create" element={<PrivateRoute isAuthenticated={isAuthenticated}><CrearReceta /></PrivateRoute>} />
            <Route path="/citashoy" element={<PrivateRoute isAuthenticated={isAuthenticated}><CitasHoy /></PrivateRoute>} />
            <Route path="/consultas/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ConsultaDetail /></PrivateRoute>} />
            <Route path="/consultascreate" element={<PrivateRoute isAuthenticated={isAuthenticated}><ConsultaCreate /></PrivateRoute>} />
            <Route path="/modulo-consulta" element={<PrivateRoute isAuthenticated={isAuthenticated}><ModuloConsulta /></PrivateRoute>} />
            <Route path="/gruposcitas-create" element={<PrivateRoute isAuthenticated={isAuthenticated}><GruposCitasCreate /></PrivateRoute>} />
            <Route path="/calendariocitas" element={<PrivateRoute isAuthenticated={isAuthenticated}><CalendarioGruposCitas /></PrivateRoute>} />
            <Route path="/grupos-citas/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><DetalleGrupoCitas /></PrivateRoute>} />
            <Route path="/pacientes" element={<PrivateRoute isAuthenticated={isAuthenticated}><PacientesList /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
