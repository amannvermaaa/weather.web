const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const z = require('zod');

const router = express.Router();

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string(),
  admin1: z.string().optional()
});

// Get all saved cities
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.savedCities);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a saved city
router.post('/', auth, async (req, res) => {
  try {
    const city = citySchema.parse(req.body);
    const user = await User.findById(req.user._id);
    
    // Check if city already exists
    if (user.savedCities.some(c => c.id === city.id)) {
      return res.status(400).json({ error: 'City already saved' });
    }

    user.savedCities.push(city);
    await user.save();
    
    res.status(201).json(user.savedCities);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a saved city
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const initialLength = user.savedCities.length;
    
    user.savedCities = user.savedCities.filter(c => c.id.toString() !== req.params.id);
    
    if (user.savedCities.length === initialLength) {
      return res.status(404).json({ error: 'City not found' });
    }

    await user.save();
    res.json(user.savedCities);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
