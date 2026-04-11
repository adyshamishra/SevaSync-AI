import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import SOSButton from './SOSButton';
import AidFeed from './components/AidFeed';
import './App.css';

// Component for Admin View
const AdminDashboard = () => (
  <div className="admin-box">
    <h2>🛠 Admin Control Center</h2>
    <div className="stats-grid">
      <div className="stat-card"><h3>24</h3><p>Active Volunteers</p></div>
      <div className="stat-card"><h3>5</h3><p>Open SOS Alerts</p></div>
    </div>
    <p className="status-text">System Status: <span className="ai-glow">Fully Operational</span></p>
  </div>
);

// Component for Volunteer View
const VolunteerTasks = () => (
  <div className="volunteer-box">
    <h2>🤝 Volunteer Task Board</h2>
    <p>Accessing real-time emergency reports...</p>
    <div className="task-actions">
       <button className="progress-update-btn">View Assigned Tasks</button>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('seva_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('seva_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seva_user');
  };

  if (!user) return <AuthScreen onLogin={login} />;

  return (
    <Router>
      <div className="app-wrapper">
        <header className="main-nav">
          <div className="nav-brand">
            <h1>SevaSync <span className="ai-glow">AI</span></h1>
            <span className="role-tag">{user.role} Mode</span>
          </div>
          <button onClick={logout} className="logout-btn">LOGOUT</button>
        </header>

        <main className="dashboard-layout">
          <Routes>
            <Route path="/admin" element={user.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/volunteer" element={user.role === 'Volunteer' ? <VolunteerTasks /> : <Navigate to="/" />} />
            <Route path="/user" element={user.role === 'User' ? <SOSButton /> : <Navigate to="/" />} />
            <Route path="/feed" element={<AidFeed role={user.role} />} />
            
            <Route path="/" element={
              user.role === 'Admin' ? <Navigate to="/admin" /> :
              user.role === 'Volunteer' ? <Navigate to="/volunteer" /> : <Navigate to="/user" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;