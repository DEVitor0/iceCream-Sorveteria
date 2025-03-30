import React from 'react';
import { Button } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const ShoppingCartButton = () => {
  return (
    <Button
      variant="outlined"
      sx={{
        width: '45px',
        height: '40px',
        borderRadius: '8px',
        minWidth: 'unset',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        backgroundColor: 'transparent',
        '&:hover': {
          border: '2px solid white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <ShoppingBagIcon
        sx={{ color: 'white', fontSize: '25px', width: '25px', height: '27px' }}
      />
    </Button>
  );
};

export default ShoppingCartButton;
