import React from 'react';
import { Box, Chip } from '@mui/material';

export default function FilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'For You' },
    { key: 'most_liked', label: 'Most Liked' },
    { key: 'most_commented', label: 'Most Commented' },
    { key: 'most_shared', label: 'Most Shared' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.2,
        overflowX: 'auto',
        pb: 1,
        mb: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <Chip
            key={filter.key}
            label={filter.label}
            onClick={() => onFilterChange(filter.key)}
            sx={{
              backgroundColor: isActive ? '#131b2e' : '#0b1426',
              color: isActive ? '#ffffff' : '#94a3b8',
              border: '1px solid',
              borderColor: isActive ? '#2563eb' : '#1f2d4d',
              px: 1,
              py: 2.2,
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#131b2e',
                borderColor: '#3b82f6',
              },
            }}
          />
        );
      })}
    </Box>
  );
}
