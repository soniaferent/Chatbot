import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardScreen from './components/DashboardScreen';
import ChatScreen from './components/ChatScreen';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Virtual Patient</h1>
        <p>Anamnesis Simulation Platform</p>
      </header>
      
      <main>
        <Routes>
          {/* Main route is now the Dashboard */}
          <Route path="/" element={<DashboardScreen />} />
          
          {/* Chat route uses a unique session ID */}
          <Route path="/chat/:sessionId" element={<ChatScreen />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;