import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PhotoCamera as CameraIcon,
  EmojiEmotions as EmojiIcon,
  List as MenuIcon,
  Campaign as PromoteIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function CreatePostCard({ onPostCreated }) {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (urlInput.trim()) {
      setImage(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Please add text or an image to post');
      return;
    }

    if (!user) {
      setError('Please login to create a post');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await axiosInstance.post('/posts', {
        text: text.trim(),
        image,
      });

      setText('');
      setImage('');
      if (onPostCreated) {
        onPostCreated(data);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2.5, border: '1px solid #1f2d4d' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Header Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#ffffff', fontSize: '1.1rem' }}>
            Create Post
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            sx={{
              minHeight: 32,
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            <Tab
              label="All Posts"
              sx={{
                minHeight: 32,
                borderRadius: '20px',
                py: 0.5,
                px: 2,
                fontSize: '0.8rem',
                backgroundColor: tabValue === 0 ? '#2563eb' : '#0f172a',
                color: tabValue === 0 ? '#ffffff !important' : '#94a3b8',
                mr: 1,
              }}
            />
            <Tab
              label="Promotions"
              sx={{
                minHeight: 32,
                borderRadius: '20px',
                py: 0.5,
                px: 2,
                fontSize: '0.8rem',
                backgroundColor: tabValue === 1 ? '#2563eb' : '#0f172a',
                color: tabValue === 1 ? '#ffffff !important' : '#94a3b8',
              }}
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
            {error}
          </Alert>
        )}

        {/* Text Input Area */}
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0b1426',
            },
          }}
        />

        {/* Image Preview if present */}
        {image && (
          <Box sx={{ position: 'relative', mb: 2, width: 'fit-content' }}>
            <Box
              component="img"
              src={image}
              alt="Post Upload Preview"
              sx={{
                maxHeight: 200,
                maxWidth: '100%',
                borderRadius: 2,
                objectFit: 'cover',
                border: '1px solid #1f2d4d',
              }}
            />
            <IconButton
              size="small"
              onClick={() => setImage('')}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#ef4444' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Image URL Input Dialog Toggle */}
        {showUrlInput && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Paste Image URL here..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button variant="contained" size="small" onClick={handleAddImageUrl}>
              Add
            </Button>
            <Button variant="outlined" size="small" onClick={() => setShowUrlInput(false)}>
              Cancel
            </Button>
          </Box>
        )}

        {/* Bottom Actions Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #1f2d4d' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <input
              type="file"
              accept="image/*"
              id="post-image-input"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <label htmlFor="post-image-input">
              <Tooltip title="Upload Photo">
                <IconButton component="span" sx={{ color: '#3b82f6' }}>
                  <CameraIcon />
                </IconButton>
              </Tooltip>
            </label>

            <Tooltip title="Add Image URL">
              <IconButton onClick={() => setShowUrlInput(!showUrlInput)} sx={{ color: '#3b82f6' }}>
                <LinkIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add Emoji">
              <IconButton sx={{ color: '#3b82f6' }}>
                <EmojiIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Menu">
              <IconButton sx={{ color: '#3b82f6' }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Button
              startIcon={<PromoteIcon />}
              size="small"
              sx={{ color: '#3b82f6', textTransform: 'none', ml: 0.5, fontWeight: 700 }}
            >
              Promote
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            disabled={loading || (!text.trim() && !image)}
            onClick={handleSubmit}
            sx={{
              fontWeight: 700,
              px: 3,
              borderRadius: '24px',
              backgroundColor: '#2563eb',
              '&:hover': { backgroundColor: '#1d4ed8' },
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
