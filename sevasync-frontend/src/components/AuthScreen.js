import React, { useState } from 'react';

const AuthScreen = ({ onLogin }) => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' });

  const handleAuth = (e) => {
    e.preventDefault();
    // Verification: If signing in, you might want to mock the role or fetch it.
    // For the hackathon demo, we use the formData role.
    onLogin({ name: formData.name || "Authorized User", role: formData.role });
  };

  return (
    <div className="auth-body">
      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleAuth}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" required />
            <select className="role-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="User">User</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleAuth}>
            <h1>Sign In</h1>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Keep the community safe.</p>
              <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>SevaSync AI</h1>
              <p>Start your journey with us today.</p>
              <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;