const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const z = require('zod');

const router = express.Router();

// Get all published posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { published: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .select('-content') // exclude heavy content for listing
      .populate('author', 'email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'email');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const commentSchema = z.object({
  content: z.string().min(1).max(500)
});

// Add a comment (Requires login)
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const parsed = commentSchema.parse(req.body);
    const comment = new Comment({
      content: parsed.content,
      post: req.params.postId,
      user: req.user._id
    });
    await comment.save();
    
    // populate user for immediate return
    await comment.populate('user', 'email');
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
