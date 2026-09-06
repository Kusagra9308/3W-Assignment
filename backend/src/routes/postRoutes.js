const express = require('express');
const router = express.Router();
const { createPost, getPosts, toggleLikePost, addCommentPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addCommentPost);

module.exports = router;
