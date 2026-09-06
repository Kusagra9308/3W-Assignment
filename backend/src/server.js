const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TaskPlanet Social API', timestamp: new Date() });
});

// Seed Initial Data Endpoint / Auto-seed for quick demo
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');

app.post('/api/seed', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.json({ message: 'Database already has data. Skipping seed.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      name: 'Nitin Pandey',
      username: '@nitin3w',
      email: 'nitin@taskplanet.com',
      password: hashedPassword,
      badge: 'Legend',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nitin3w',
    });

    const user2 = await User.create({
      name: 'Chikatipalli Nagaraju',
      username: '@bishnu',
      email: 'bishnu@taskplanet.com',
      password: hashedPassword,
      badge: 'Gold',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bishnu',
    });

    const user3 = await User.create({
      name: 'Sujoy Panja',
      username: '@sujoyq24i',
      email: 'sujoy@taskplanet.com',
      password: hashedPassword,
      badge: 'Silver',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sujoyq24i',
    });

    const user4 = await User.create({
      name: 'Robin Thomas',
      username: '@thomass5c4',
      email: 'robin@taskplanet.com',
      password: hashedPassword,
      badge: 'Gold',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomass5c4',
    });

    await Post.create([
      {
        author: {
          userId: user1._id,
          name: user1.name,
          username: user1.username,
          avatar: user1.avatar,
          badge: user1.badge,
        },
        text: 'Earn Up to 10,000 Points with CPA Lead!\nTry CPA Lead offers, surveys and tasks to earn points. If an eligible verified task isn\'t credited, compensation may be given after verification. Please, Keep screenshots as proof.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
        likes: [
          { userId: user2._id, name: user2.name, username: user2.username },
          { userId: user3._id, name: user3.name, username: user3.username },
        ],
        comments: [
          {
            userId: user2._id,
            name: user2.name,
            username: user2.username,
            avatar: user2.avatar,
            text: 'Great offer! Completed it yesterday.',
          },
        ],
      },
      {
        author: {
          userId: user2._id,
          name: user2.name,
          username: user2.username,
          avatar: user2.avatar,
          badge: user2.badge,
        },
        text: 'Good evening everyone',
        image: '',
        likes: [{ userId: user1._id, name: user1.name, username: user1.username }],
        comments: [
          {
            userId: user2._id,
            name: user2.name,
            username: user2.username,
            avatar: user2.avatar,
            text: 'Nice',
          },
        ],
      },
      {
        author: {
          userId: user3._id,
          name: user3.name,
          username: user3.username,
          avatar: user3.avatar,
          badge: user3.badge,
        },
        text: 'Good evening everyone',
        image: '',
        likes: [
          { userId: user1._id, name: user1.name, username: user1.username },
          { userId: user4._id, name: user4.name, username: user4.username },
        ],
        comments: [
          {
            userId: user4._id,
            name: user4.name,
            username: user4.username,
            avatar: user4.avatar,
            text: 'Good evening Sujoy!',
          },
          {
            userId: user1._id,
            name: user1.name,
            username: user1.username,
            avatar: user1.avatar,
            text: 'Welcome to TaskPlanet social community!',
          },
        ],
      },
      {
        author: {
          userId: user4._id,
          name: user4.name,
          username: user4.username,
          avatar: user4.avatar,
          badge: user4.badge,
        },
        text: 'Good night everyone. Follow me and I shall do the same.',
        image: '',
        likes: [
          { userId: user2._id, name: user2.name, username: user2.username },
          { userId: user3._id, name: user3.name, username: user3.username },
        ],
        comments: [],
      },
    ]);

    res.json({ message: 'Seed data created successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seed error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
