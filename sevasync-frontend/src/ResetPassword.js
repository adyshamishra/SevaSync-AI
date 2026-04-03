import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // Hits the route you just added to authRoutes.js
      await axios.post(`http://localhost:5000/api/auth/reset/${token}`, { password });
      alert("✅ Password Updated! You can now log in.");
      navigate('/'); 
    } catch (err) {
      alert("❌ Reset failed. The link might be expired.");
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleReset} style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        <h2>Set New Password</h2>
        <p style={{ color: '#ccc' }}>Enter your new secure password below.</p>
        <input 
          type="password" 
          placeholder="New Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', width: '100%', borderRadius: '5px', marginBottom: '20px', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' }}
          required 
        />
        <br />
        <button type="submit" style={{ backgroundColor: '#61dafb', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;