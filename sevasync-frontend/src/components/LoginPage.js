import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a login success
    onLogin({ name, role });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>SevaSync AI</h2>
        <p>Login to the Community Hub</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User (Request Help)</option>
            <option value="Volunteer">Volunteer (Provide Aid)</option>
            <option value="Admin">Admin (Control Center)</option>
          </select>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;