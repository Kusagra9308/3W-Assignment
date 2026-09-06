const Post = require('../models/Post');

// @desc Create a new post
// @route POST /api/posts
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: 'Post must contain either text or an image' });
    }

    const post = await Post.create({
      author: {
        userId: req.user._id,
        name: req.user.name,
        username: req.user.username,
        avatar: req.user.avatar,
        badge: req.user.badge,
      },
      text: text ? text.trim() : '',
      image: image || '',
      likes: [],
      comments: [],
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// @desc Get public post feed with pagination and filters
// @route GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const filter = req.query.filter || 'all';
    const skip = (page - 1) * limit;

    let posts;
    let totalPosts = await Post.countDocuments();

    if (filter === 'most_liked') {
      posts = await Post.aggregate([
        {
          $addFields: {
            likesCount: { $size: '$likes' },
          },
        },
        { $sort: { likesCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else if (filter === 'most_commented') {
      posts = await Post.aggregate([
        {
          $addFields: {
            commentsCount: { $size: '$comments' },
          },
        },
        { $sort: { commentsCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      // Default / For You / All Posts: sorted by newest first
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.json({
      posts,
      pagination: {
        totalPosts,
        page,
        totalPages: Math.ceil(totalPosts / limit) || 1,
        hasMore: page * limit < totalPosts,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// @desc Toggle Like/Unlike on a post
// @route POST /api/posts/:id/like
const toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLikeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === userId.toString()
    );

    if (existingLikeIndex > -1) {
      // Unlike
      post.likes.splice(existingLikeIndex, 1);
    } else {
      // Like
      post.likes.push({
        userId: req.user._id,
        name: req.user.name,
        username: req.user.username,
      });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// @desc Add comment to a post
// @route POST /api/posts/:id/comment
const addCommentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId: req.user._id,
      name: req.user.name,
      username: req.user.username,
      avatar: req.user.avatar,
      text: text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLikePost,
  addCommentPost,
};
