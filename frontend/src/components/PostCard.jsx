import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite as HeartFilledIcon,
  FavoriteBorder as HeartOutlinedIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  MoreHoriz as MoreIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import CommentsModal from './CommentsModal';

export default function PostCard({ post, onPostUpdated }) {
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState(post);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [following, setFollowing] = useState(false);

  // Check if logged in user liked this post
  const isLikedByMe =
    user &&
    currentPost.likes &&
    currentPost.likes.some((l) => l.userId === user.id || l.userId === user._id);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts!');
      return;
    }

    if (isLiking) return;

    // Optimistic UI Update
    const prevLikes = [...(currentPost.likes || [])];
    const newLikes = isLikedByMe
      ? prevLikes.filter((l) => l.userId !== user.id && l.userId !== user._id)
      : [...prevLikes, { userId: user.id || user._id, name: user.name, username: user.username }];

    setCurrentPost((prev) => ({
      ...prev,
      likes: newLikes,
    }));

    try {
      setIsLiking(true);
      const { data } = await axiosInstance.post(`/posts/${currentPost._id}/like`);
      setCurrentPost(data);
      if (onPostUpdated) {
        onPostUpdated(data);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setCurrentPost((prev) => ({
        ...prev,
        likes: prevLikes,
      }));
    } finally {
      setIsLiking(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Legend':
        return '7 👑 Legend';
      case 'Gold':
        return '3 🪙 Gold';
      case 'Silver':
        return '2 🥈 Silver';
      default:
        return 'Member';
    }
  };

  return (
    <>
      <Card sx={{ mb: 2, border: '1px solid #1f2d4d' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={currentPost.author?.avatar}
                alt={currentPost.author?.name}
                sx={{
                  width: 44,
                  height: 44,
                  border: '2px solid #1f2d4d',
                  backgroundColor: '#2563eb',
                }}
              >
                {currentPost.author?.name ? currentPost.author.name[0] : 'U'}
              </Avatar>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                    {currentPost.author?.name}
                  </Typography>

                  <Chip
                    label={getBadgeIcon(currentPost.author?.badge)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(234, 179, 8, 0.15)',
                      color: '#eab308',
                      border: '1px solid rgba(234, 179, 8, 0.3)',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {currentPost.author?.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    • {formatTime(currentPost.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Action Buttons: Follow & Options */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant={following ? 'outlined' : 'contained'}
                size="small"
                onClick={() => setFollowing(!following)}
                sx={{
                  borderRadius: '20px',
                  px: 2,
                  py: 0.4,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: following ? 'transparent' : '#2563eb',
                  borderColor: '#2563eb',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: following ? 'rgba(37, 99, 235, 0.1)' : '#1d4ed8',
                  },
                }}
              >
                {following ? 'Following' : 'Follow'}
              </Button>

              <IconButton size="small" sx={{ color: '#94a3b8' }}>
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Post Text Content */}
          {currentPost.text && (
            <Typography
              variant="body1"
              sx={{
                color: '#f1f5f9',
                mb: currentPost.image ? 1.5 : 2,
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
              }}
            >
              {currentPost.text}
            </Typography>
          )}

          {/* Post Image Content */}
          {currentPost.image && (
            <Box
              sx={{
                mb: 2,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #1f2d4d',
                backgroundColor: '#0b1426',
                maxHeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={currentPost.image}
                alt="Post Media"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {/* Stats Footer Row: Like, Comment, Share */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 4,
              pt: 1,
              borderTop: '1px solid #1f2d4d',
            }}
          >
            {/* Like Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Tooltip title={isLikedByMe ? 'Unlike' : 'Like'}>
                <IconButton size="small" onClick={handleLike} sx={{ color: isLikedByMe ? '#ef4444' : '#94a3b8' }}>
                  {isLikedByMe ? <HeartFilledIcon /> : <HeartOutlinedIcon />}
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                {currentPost.likes?.length || 0}
              </Typography>
            </Box>

            {/* Comment Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Tooltip title="Comments">
                <IconButton size="small" onClick={() => setCommentsOpen(true)} sx={{ color: '#94a3b8' }}>
                  <CommentIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                {currentPost.comments?.length || 0}
              </Typography>
            </Box>

            {/* Share Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Tooltip title="Share">
                <IconButton size="small" sx={{ color: '#94a3b8' }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                0
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Comments Drawer / Modal */}
      <CommentsModal
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        post={currentPost}
        onPostUpdated={(updatedPost) => {
          setCurrentPost(updatedPost);
          if (onPostUpdated) onPostUpdated(updatedPost);
        }}
      />
    </>
  );
}
