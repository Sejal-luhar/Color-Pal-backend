// models/Palette.js
const mongoose = require('mongoose');

const paletteSchema = new mongoose.Schema({
  baseColor: { 
    type: String, 
    required: true,
    match: /^#[0-9A-F]{6}$/i,  // Simple hex color validation (optional)
  },
  colors: [
    {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i,  // Hex color code validation
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Palette', paletteSchema);
