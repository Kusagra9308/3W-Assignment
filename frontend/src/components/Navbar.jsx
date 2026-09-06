import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  InputBase,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  NightsStay as MoonIcon,
  Home as HomeIcon,
  Assignment as TasksIcon,
  Language as SocialIcon,
  Leaderboard as LeaderboardIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [navValue, setNavValue] = useState(2); // 2 = Social

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Header App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#0b1426',
          borderBottom: '1px solid #1f2d4d',
          px: { xs: 1, sm: 2 },
          py: 0.5,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
          {/* Logo / Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Social
          </Typography>

          {/* User Points, Balance & Quick Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Points Chip */}
            <Chip
              label="50 ⭐"
              size="small"
              sx={{
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308',
                borderColor: 'rgba(234, 179, 8, 0.3)',
                borderWidth: 1,
                borderStyle: 'solid',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            />

            {/* Currency Pill */}
            <Chip
              label="₹0.00"
              size="small"
              sx={{
                backgroundColor: '#131b2e',
                color: '#ffffff',
                borderColor: '#1f2d4d',
                borderWidth: 1,
                borderStyle: 'solid',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            />

            {/* Moon Icon */}
            <IconButton size="small" sx={{ color: '#eab308' }}>
              <MoonIcon />
            </IconButton>

            {/* Profile Avatar / Login Button */}
            {user ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{
                        width: 38,
                        height: 38,
                        border: '2px solid #2563eb',
                        backgroundColor: '#2563eb',
                      }}
                    >
                      {user.name ? user.name[0] : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#131b2e',
                      color: '#ffffff',
                      border: '1px solid #1f2d4d',
                      minWidth: 180,
                      mt: 1,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {user.username} ({user.badge})
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleLogout} sx={{ gap: 1, color: '#ef4444' }}>
                    <LogoutIcon fontSize="small" /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Chip
                label="Login"
                color="primary"
                onClick={() => navigate('/login')}
                clickable
              />
            )}
          </Box>
        </Toolbar>

        {/* Search Bar Bar */}
        <Box sx={{ px: 2, pb: 1.5, pt: 0.5, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Paper
            component="form"
            sx={{
              p: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              backgroundColor: '#131b2e',
              border: '1px solid #1f2d4d',
              borderRadius: '24px',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color: '#ffffff', fontSize: '0.9rem' }}
              placeholder="Search promotions, users, posts..."
            />
            <IconButton type="button" sx={{ p: '6px', color: '#3b82f6' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          {user && (
            <Avatar
              src={user.avatar}
              sx={{ width: 36, height: 36, backgroundColor: '#2563eb' }}
            />
          )}
        </Box>
      </AppBar>

      {/* Bottom Navigation Bar for Mobile / TaskPlanet Theme */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#0b1426',
          borderTop: '1px solid #1f2d4d',
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => {
            setNavValue(newValue);
            if (newValue === 2) navigate('/');
          }}
          sx={{
            backgroundColor: '#0b1426',
            '& .MuiBottomNavigationAction-root': {
              color: '#64748b',
              minWidth: 'auto',
              padding: '6px 0',
              '&.Mui-selected': {
                color: '#2563eb',
              },
            },
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Tasks" icon={<TasksIcon />} />
          <BottomNavigationAction label="Social" icon={<SocialIcon />} />
          <BottomNavigationAction label="Leader Board" icon={<LeaderboardIcon />} />
          <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
}
