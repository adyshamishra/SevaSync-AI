const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  // Supports the categories we'll use in the frontend dropdown
  category: { 
    type: String, 
    enum: ['Medical', 'Food', 'Transport', 'General', 'Safety'],
    default: 'General' 
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // Added image field to store the filename from Multer
  image: {
    type: String,
    default: null
  },
  // Matches your Step 14 Flow Chart
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Completed'],
    default: 'Reported',
  },
  // SOS Specific Fields
  isEmergency: { 
    type: Boolean, 
    default: false 
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  // Useful for displaying "Posted 2 hours ago" in the feed
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);