import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPaciente from './components/RegisterPaciente';
import Login from './components/Login';
import Home from './components/Home';
import HistoriasClinicas from './components/HistoriasClinicas';
import Diagnosticos from './components/Diagnosticos';

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
        <div className="flex-grow bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
