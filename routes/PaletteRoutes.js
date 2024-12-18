const express = require('express');
const tinycolor = require('tinycolor2');
const Palette = require('../models/palette');

const router = express.Router();

const generatePalette = (baseColor, numColors = 10) => {
  const palette = [];
  for (let i = 0; i < numColors; i++) {
    const color = tinycolor(baseColor).lighten(i * 5).toString();
    palette.push(color);
  }
  return palette;
};

// Generate palette route
router.post('/generate', async (req, res) => {
    const { baseColor } = req.body;
    console.log("Received base color:", baseColor); // Log the received color for debugging
    
    // Basic validation (for backend-side sanity check)
    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorRegex.test(baseColor)) {
      return res.status(400).json({ error: 'Invalid color format. Please provide a valid hex color.' });
    }
  
    // Proceed with your palette generation logic
    try {
      const generatedPalette = generatePalette(baseColor); // Assuming generatePalette function exists
      res.json({ colors: generatedPalette });
    } catch (error) {
      console.error('Error generating palette:', error);
      res.status(500).json({ error: 'Failed to generate palette. Please try again.' });
    }
  });
  

// Save palette
router.post('/save', async (req, res) => {
    const { baseColor, colors } = req.body;
  
    // Color format validation (ensure both are valid hex colors)
    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorRegex.test(baseColor)) {
      return res.status(400).json({ error: 'Invalid base color format. Please provide a valid hex color.' });
    }
    
    for (let color of colors) {
      if (!hexColorRegex.test(color)) {
        return res.status(400).json({ error: `Invalid color format for color: ${color}. Please provide a valid hex color.` });
      }
    }
  
    try {
      const palette = new Palette({ baseColor, colors });
      await palette.save();
      res.json({ message: 'Palette saved successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save palette' });
    }
  });
  
  // Route to fetch saved palettes
  router.get('/palettes', async (req, res) => {
    try {
      const palettes = await Palette.find();
      console.log('Fetched Palettes:', palettes); // Log the data from DB
      if (!palettes || palettes.length === 0) {
        return res.status(404).json({ error: 'No palettes found.' });
      }
      res.json(palettes); // Return the array of palettes
    } catch (error) {
      console.error('Error fetching palettes:', error); // Log any errors
      res.status(500).json({ error: 'Failed to fetch palettes' });
    }
  });
  
  router.delete('/palettes/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the palette by ID and delete it
      const deletedPalette = await Palette.findByIdAndDelete(id);
  
      if (!deletedPalette) {
        return res.status(404).json({ message: 'Palette not found' });
      }
  
      res.status(200).json({ message: 'Palette deleted successfully', palette: deletedPalette });
    } catch (error) {
      console.error('Error deleting palette:', error);
      res.status(500).json({ message: 'Server error. Could not delete palette.' });
    }
  });
  

module.exports = router;
