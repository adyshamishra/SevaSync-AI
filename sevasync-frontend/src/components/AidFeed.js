import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AidFeed = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
    };

    useEffect(() => {
        fetchPosts();
        // Refresh feed every 30 seconds for live SOS updates
        const interval = setInterval(fetchPosts, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="feed-container">
            <h2>Community Activity</h2>
            {posts.map(post => (
                <div key={post._id} className={`post-card ${post.isEmergency ? 'emergency-border' : ''}`} style={{
                    border: post.isEmergency ? '2px solid red' : '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    background: post.isEmergency ? '#fff5f5' : 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: post.isEmergency ? 'red' : '#333' }}>
                            {post.isEmergency ? '🚨 EMERGENCY' : post.category}
                        </span>
                        <small>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>
                    
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    
                    {post.image && (
                        <img 
                            src={`http://localhost:5000/uploads/posts/${post.image}`} 
                            alt="Evidence" 
                            style={{ width: '100%', borderRadius: '5px', marginTop: '10px' }} 
                        />
                    )}
                    
                    <div style={{ marginTop: '10px' }}>
                        <span className={`status-badge ${post.status.replace(' ', '-')}`}>
                            Status: {post.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AidFeed;