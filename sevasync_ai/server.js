const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Import your Route files
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const sosRoutes = require('./routes/sosRoutes'); // New SOS Route

dotenv.config();

const app = express();

// 2. Middleware
app.use(cors()); // Allows React (port 3000) to talk to Node (port 5000)
app.use(express.json()); // Allows the server to read JSON data

// 3. Link the Routes to the API paths
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sos', sosRoutes); // This activates the SOS path

// 4. Database Connection (MongoDB Atlas)
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Simple test route to check if server is alive
app.get('/', (req, res) => {
  res.send("SevaSync AI Server is Running...");
});