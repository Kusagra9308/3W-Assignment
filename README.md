# 3W-Assignment: Mini Social Post Application (TaskPlanet Clone)

A full-stack Mini Social Post application built for the **3W Full Stack Internship Assignment**, inspired by the **TaskPlanet App** social feed.



##  Key Features

- **Authentication (Access & Refresh Tokens)**:
  - Secure JWT authentication with short-lived **Access Tokens** (15 minutes) and long-lived **Refresh Tokens** (7 days stored in MongoDB).
  - Frontend Axios interceptor performs **silent token auto-refresh** upon 401 errors without logging out users.
- **Strict 2 MongoDB Collections Limit**:
  - `users`: User profiles, authentication credentials, badges (`Legend`, `Gold`, `Silver`), and active refresh tokens.
  - `posts`: Embedded author info, text, optional image (Base64 file upload or image URL), embedded `likes` array, and embedded `comments` array.
- **TaskPlanet Inspired Dark UI**:
  - Built with **Material UI (MUI)**. (No TailwindCSS used).
  - Includes top navigation bar (`50 ⭐`, `₹0.00`), Create Post card, filter chips (`For You`, `Most Liked`, `Most Commented`), and bottom navigation bar.
- **Social Interactions**:
  - Create posts with text, images (Base64 file upload or URL), or both.
  - Public feed with pagination (`Load More`).
  - Real-time like/unlike toggle and interactive comments drawer.

---

##  Repository Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── postController.js
│   │   ├── middleware/authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js          # Collection 1 of 2
│   │   │   └── Post.js          # Collection 2 of 2
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── postRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axiosInstance.js # Auto refresh token interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── CreatePostCard.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── CommentsModal.jsx
    │   │   └── FilterTabs.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Feed.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── theme.js             # MUI Dark Theme
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

##  Local Quickstart

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`.

---

##  Demo Login Credentials

| Email | Password | Username | Badge Tier |
| :--- | :--- | :--- | :--- |
| `nitin@taskplanet.com` | `password123` | `@nitin3w` | 7 👑 Legend |
| `bishnu@taskplanet.com` | `password123` | `@bishnu` | 3 🪙 Gold |
| `sujoy@taskplanet.com` | `password123` | `@sujoyq24i` | 2 🥈 Silver |
| `robin@taskplanet.com` | `password123` | `@thomass5c4` | 3 🪙 Gold |
