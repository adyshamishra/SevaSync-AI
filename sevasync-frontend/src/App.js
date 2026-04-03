import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import './App.css';

// --- NEW: This component holds your main SevaSync Dashboard logic ---
function MainDashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  
  const timerRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleForgotPassword = async () => {
    const email = window.prompt("Enter your Admin Email to reset password:");
    if (!email) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/forgot-password', { email });
      alert("📧 Check your email for the reset link!");
    } catch (err) {
      alert("❌ Failed to send reset email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/posts', { title, category });
      setTitle('');
      fetchPosts(); 
    } catch (err) {
      alert("Error: Backend is not responding.");
    }
    setLoading(false);
  };

  const startSOSTimer = () => {
    timerRef.current = setTimeout(triggerSOS, 3000); 
  };

  const cancelSOSTimer = () => {
    clearTimeout(timerRef.current);
  };

  const triggerSOS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post('http://localhost:5000/api/posts/sos', { lat: latitude, lng: longitude });
          alert("🚨 EMERGENCY SOS SENT SUCCESSFULLY!");
          fetchPosts();
        } catch (err) {
          alert("SOS Failed to send.");
        }
      });
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("Delete this task?")) {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      fetchPosts(); 
    }
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`http://localhost:5000/api/posts/${id}`, { status });
    fetchPosts();
  };

  return (
    <div className="App" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SevaSync AI Dashboard</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handleForgotPassword} style={{ backgroundColor: 'transparent', color: '#61dafb', border: '1px solid #61dafb', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
            Forgot Password?
          </button>
          <button onMouseDown={startSOSTimer} onMouseUp={cancelSOSTimer} onMouseLeave={cancelSOSTimer} onTouchStart={startSOSTimer} onTouchEnd={cancelSOSTimer}
            style={{ backgroundColor: '#ff0000', color: 'white', fontWeight: 'bold', padding: '15px 30px', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 0 15px rgba(255,0,0,0.5)' }}>
            HOLD 3S FOR SOS 🚨
          </button>
        </div>
      </div>

      <p>Empowering community service with Intelligence</p>
      
      <form onSubmit={handleSubmit} style={{ margin: '30px 0' }}>
        <input type="text" placeholder="What is the community need?" value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '12px', width: '350px', borderRadius: '5px', border: 'none' }} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', marginLeft: '10px' }}>
          <option value="General">General</option>
          <option value="Urgent">Urgent</option>
          <option value="Community">Community</option>
        </select>
        <button type="submit" disabled={loading} style={{ padding: '12px 25px', marginLeft: '10px', backgroundColor: '#61dafb', color: 'black', fontWeight: 'bold' }}>
          {loading ? "AI is Thinking..." : "Add Task"}
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {posts.map(post => (
          <div key={post._id} style={{ backgroundColor: post.isEmergency ? '#4a0000' : '#2d2d2d', padding: '20px', borderRadius: '10px', width: '80%', textAlign: 'left', borderLeft: post.isEmergency ? '5px solid #ff0000' : '5px solid #61dafb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: '0' }}>{post.title}</h3>
              <select value={post.status} onChange={(e) => updateStatus(post._id, e.target.value)} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                <option value="Reported">Reported</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <p style={{ color: '#ccc', margin: '15px 0' }}>{post.description}</p>
            {post.location && <small style={{ display: 'block', color: '#ff4d4d', marginBottom: '10px' }}>📍 Coordinates: {post.location.lat}, {post.location.lng}</small>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <small style={{ color: post.isEmergency ? '#ff4d4d' : '#61dafb' }}>
                {post.isEmergency ? "🚨 EMERGENCY ALERT" : "✨ Gemini AI Insight"} | {post.category}
              </small>
              <button onClick={() => deletePost(post._id)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP COMPONENT: Handles the "Pages" ---
function App() {
  return (
    <Router>
      <Routes>
        {/* URL: http://localhost:3000/ */}
        <Route path="/" element={<MainDashboard />} />
        
        {/* URL: http://localhost:3000/reset/ANY_TOKEN_HERE */}
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;