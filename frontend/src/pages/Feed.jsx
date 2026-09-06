import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import Navbar from '../components/Navbar';
import CreatePostCard from '../components/CreatePostCard';
import FilterTabs from '../components/FilterTabs';
import PostCard from '../components/PostCard';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(
    async (pageNum = 1, activeFilter = filter, append = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const { data } = await axiosInstance.get(
          `/posts?page=${pageNum}&limit=10&filter=${activeFilter}`
        );

        if (append) {
          setPosts((prev) => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }

        setHasMore(data.pagination.hasMore);
        setError('');
      } catch (err) {
        console.error('Fetch posts error:', err);
        setError('Failed to load social feed. Please try again.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    setPage(1);
    fetchPosts(1, filter, false);
  }, [filter, fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, filter, true);
    }
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/seed');
      fetchPosts(1, filter, false);
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0b1426', pb: 10 }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Feed Container */}
      <Container maxWidth="sm" sx={{ pt: 2, px: { xs: 1.5, sm: 2 } }}>
        {/* Create Post Card */}
        {user ? (
          <CreatePostCard onPostCreated={handlePostCreated} />
        ) : (
          <Paper
            sx={{
              p: 2.5,
              mb: 2.5,
              textAlign: 'center',
              backgroundColor: '#131b2e',
              border: '1px solid #1f2d4d',
            }}
          >
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1.5 }}>
              Sign up or Log in to post text, images, like, and comment!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ fontWeight: 700, borderRadius: '20px' }}
            >
              Get Started
            </Button>
          </Paper>
        )}

        {/* Filter Chips */}
        <FilterTabs activeFilter={filter} onFilterChange={handleFilterChange} />

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={(updatedPost) => {
                  setPosts((prev) =>
                    prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                  );
                }}
              />
            ))}

            {/* Load More Pagination */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', my: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{
                    color: '#3b82f6',
                    borderColor: '#1f2d4d',
                    borderRadius: '24px',
                    px: 4,
                  }}
                >
                  {loadingMore ? <CircularProgress size={20} /> : 'Load More Posts'}
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: '#131b2e',
              border: '1px solid #1f2d4d',
            }}
          >
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
              No posts found
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
              Be the first to share something with the community!
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleSeedData}>
              Load Demo TaskPlanet Feed Data
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
