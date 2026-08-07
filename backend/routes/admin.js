const express = require('express');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const z = require('zod');

const router = express.Router();

// Apply auth and authAdmin to all routes in this router
router.use(auth);
router.use(authAdmin);

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const activeAlerts = await Alert.countDocuments({ active: true });
    
    // Mock API Usage Data (Last 7 Days)
    const apiUsage = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 5000) + 1000,
      errors: Math.floor(Math.random() * 50)
    }));

    // Mock Uptime & Health
    const health = {
      status: 'Healthy',
      uptime: process.uptime(), // seconds
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };

    res.json({
      totalUsers,
      adminUsers,
      activeAlerts,
      apiUsage,
      health
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all global alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).populate('createdBy', 'email');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const alertSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),
  severity: z.enum(['info', 'warning', 'danger']),
  active: z.boolean().default(true)
});

// Create a new global alert
router.post('/alerts', async (req, res) => {
  try {
    const parsed = alertSchema.parse(req.body);
    const alert = new Alert({
      ...parsed,
      createdBy: req.user._id
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a global alert
router.delete('/alerts/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// -- BLOG MANAGEMENT --

router.get('/blog', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  category: z.string().default('General'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  published: z.boolean().default(true)
});

router.post('/blog', async (req, res) => {
  try {
    const parsed = postSchema.parse(req.body);
    const post = new Post({
      ...parsed,
      author: req.user._id
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/blog/:id', async (req, res) => {
  try {
    const parsed = postSchema.parse(req.body);
    const post = await Post.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
