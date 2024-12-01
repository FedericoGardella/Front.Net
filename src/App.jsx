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

const App = () => {
  const [selectedTab, setSelectedTab] = useState('Location1');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comprueba si el token está en el almacenamiento local cuando la app se monta
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/create-user"
              element={
                isAuthenticated ? <RegisterPaciente /> : <Navigate to="/login" />
              }
            />
            <Route path="/historiasclinicas" element={<HistoriasClinicas />} />
            
            <Route path="/diagnosticos/:id" element={<Diagnosticos />} />
            <Route path="/resultadosestudios/:id" element={<ResultadosEstudios/>} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/recetas/:id" element={<Recetas />} />
            <Route path="/diagnosticos/:id/create" element={<CrearDiagnostico />} />
            <Route path="/resultadosestudios/:id/create" element={<CrearResultadoEstudio />} />
            <Route path="/recetas/:id/create" element={<CrearReceta />} />
            <Route path="/citashoy" element={<CitasHoy />} />
            <Route path="/consultas/:id" element={<ConsultaDetail />} />
            <Route path="/consultascreate" element={<ConsultaCreate />} />
            <Route path="/modulo-consulta" element={<ModuloConsulta />} />
            <Route path="/gruposcitas-create" element={<GruposCitasCreate />} />
            <Route path="/calendariocitas" element={<CalendarioGruposCitas />} />
            <Route path="/grupos-citas/:id" element={<DetalleGrupoCitas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
