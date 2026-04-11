const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/Post');
const { generateDescription } = require('../utils/gemini');

// --- 1. SETUP IMAGE STORAGE (New Addition) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `POST-${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });


// --- 2. GET: Fetch all tasks (Normal & SOS) ---
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- 3. POST: Report Normal Issue (Updated with Image & Multer) ---
// Now supports 'upload.single('image')'
router.post('/', upload.single('image'), async (req, res) => {
  const { title, category, lat, lng, address } = req.body;
  
  try {
    // Step 7: AI Understanding (Gemini)
    const description = await generateDescription(title);
    
    const newPost = new Post({ 
      title, 
      category, 
      description,
      image: req.file ? req.file.filename : null, // Saves image if uploaded
      isEmergency: false,
      status: 'Reported',
      location: { 
        lat: lat ? parseFloat(lat) : null, 
        lng: lng ? parseFloat(lng) : null,
        address 
      }
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// --- 4. POST: Trigger Emergency SOS (Kept your original logic) ---
router.post('/sos', async (req, res) => {
  const { lat, lng } = req.body;
  
  const newSOS = new Post({
    title: "🚨 EMERGENCY SOS TRIGGERED",
    category: "Emergency",
    description: `IMMEDIATE ASSISTANCE REQUIRED. Location captured at coordinates: ${lat}, ${lng}`,
    isEmergency: true,
    status: 'Reported',
    location: { lat, lng }
  });

  try {
    const savedSOS = await newSOS.save();
    res.status(201).json(savedSOS);
  } catch (err) {
    res.status(400).json({ message: "SOS ingestion failed" });
  }
});


// --- 5. PATCH: Update Issue Status ---
router.patch('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Status update failed" });
  }
});


// --- 6. DELETE: Admin Coordination ---
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed from system" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;