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
import PreciosEspecialidadesList from './components/PreciosEspecialidadesList';
import PreciosEspecialidadesCreate from './components/PreciosEspecialidadesCreate';
import PreciosEspecialidadesUpdateCosto from './components/PreciosEspecialidadesUpdateCosto';
import TiposSegurosList from './components/TiposSegurosList';
import TiposSegurosCreate from './components/TiposSegurosCreate';
import TiposSegurosUpdateCosto from './components/TiposSegurosUpdateCosto';
import ContratosSegurosCreate from './components/ContratosSegurosCreate';
import ContratosSegurosCancel from './components/ContratosSegurosCancel';

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
            <Route path="/precios-especialidades" element={<PreciosEspecialidadesList />} />
            <Route path='/precios-especialidades/create' element={<PreciosEspecialidadesCreate />} />
            <Route path='/update-costo/:id' element={<PreciosEspecialidadesUpdateCosto />} />
            <Route path="/tipos-seguros" element={<TiposSegurosList />} />
            <Route path="/tipos-seguros/create" element={<TiposSegurosCreate />} />
            <Route path="/tipos-seguros/update-costo/:id" element={<TiposSegurosUpdateCosto />} />
            <Route path="/contratos-seguros/create" element={<ContratosSegurosCreate />} />
            <Route path="/contratos-seguros/cancel" element={<ContratosSegurosCancel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
