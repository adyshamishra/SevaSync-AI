import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        if (image) formData.append('image', image);

        try {
            // This hits your new 'router.post('/')' in postRoutes.js
            await axios.post('http://localhost:5000/api/posts', formData);
            setTitle('');
            setImage(null);
            alert("Post Created! AI is generating your description...");
            onPostCreated(); // Refresh the feed
        } catch (err) {
            console.error("Error creating post", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-card" style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px', marginBottom: '20px' }}>
            <h3>📢 Request Community Aid</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="What do you need help with? (e.g. Broken Streetlight)" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginBottom: '10px', padding: '10px' }}>
                    <option value="General">General</option>
                    <option value="Medical">Medical</option>
                    <option value="Safety">Safety</option>
                    <option value="Transport">Transport</option>
                </select>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])}
                    style={{ marginLeft: '10px' }}
                />
                <button type="submit" disabled={loading} style={{ display: 'block', marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    {loading ? 'AI Generating...' : 'Post Request'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;