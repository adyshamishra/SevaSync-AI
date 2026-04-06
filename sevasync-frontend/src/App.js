import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import SOSButton from './SOSButton'; // This imports the file we just made!

function App() {
  return (
    <Router>
      <div className="App" style={{ textAlign: 'center', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
        
        {/* Navigation / Header */}
        <header style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <h1>SevaSync AI</h1>
          <p>Community Safety & Service Hub</p>
        </header>

        {/* Main Content Area */}
        <main style={{ padding: '40px' }}>
          <Routes>
            {/* 1. This is your Dashboard with the SOS Button */}
            <Route path="/" element={
              <div>
                <h2>Emergency Dashboard</h2>
                <p>In case of danger, hold the button below for 3 seconds.</p>
                <div style={{ marginTop: '50px' }}>
                  <SOSButton />
                </div>
              </div>
            } />

            {/* 2. This is the Reset Password page we finished earlier */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;