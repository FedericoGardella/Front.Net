import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPaciente from './components/RegisterPaciente';

const App = () => {
  const [selectedTab, setSelectedTab] = useState('Location1');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  }

  return (
    <Router>
      <div className="overflow-x-hidden h-screen flex flex-col">
        {/* Fondo de la aplicación */}
        <div className="flex-grow bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          <Navbar selectedTab={selectedTab} onTabClick={handleTabClick} />
          <Routes>
            <Route path='/create-user' element={<RegisterPaciente />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



