import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function CommentsModal({ open, onClose, post, onPostUpdated }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!post) return null;

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (!user) {
      setError('Please login to comment');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await axiosInstance.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });

      setCommentText('');
      if (onPostUpdated) {
        onPostUpdated(data);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: '#0b1426',
          color: '#ffffff',
          borderRadius: 4,
          border: '1px solid #1f2d4d',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Comments ({post.comments?.length || 0})
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: '#1f2d4d' }} />

      <DialogContent sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
            {error}
          </Alert>
        )}

        {/* Existing Comments List */}
        {post.comments && post.comments.length > 0 ? (
          <List disablePadding>
            {post.comments.map((c, index) => (
              <React.Fragment key={c._id || index}>
                <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar
                      src={c.avatar}
                      alt={c.name}
                      sx={{ width: 38, height: 38, border: '1px solid #1f2d4d' }}
                    >
                      {c.name ? c.name[0] : 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {c.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                          {formatTime(c.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#e2e8f0', mt: 0.5, whiteSpace: 'pre-line' }}>
                        {c.text}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < post.comments.length - 1 && <Divider component="li" sx={{ borderColor: '#1f2d4d' }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider sx={{ borderColor: '#1f2d4d' }} />

      {/* Input Box Row */}
      <DialogActions sx={{ p: 2, backgroundColor: '#131b2e', display: 'flex', gap: 1 }}>
        <IconButton size="small" sx={{ color: '#94a3b8' }}>
          <EmojiIcon />
        </IconButton>

        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: '#0b1426',
            },
          }}
        />

        <IconButton
          color="primary"
          disabled={loading || !commentText.trim()}
          onClick={handleAddComment}
          sx={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#1d4ed8' },
            '&.Mui-disabled': { backgroundColor: '#1f2d4d', color: '#64748b' },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
