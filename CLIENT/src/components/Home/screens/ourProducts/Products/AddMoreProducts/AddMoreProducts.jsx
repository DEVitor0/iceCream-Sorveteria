import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';

const AddMoreProducts = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) setCount(count - 1);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      borderRadius="5px"
      sx={{
        width: '110px',
        height: '42px',
        border: '2px solid white',
        bgcolor: 'transparent',
        overflow: 'hidden',
      }}
    >
      <Button
        variant="text"
        onClick={handleDecrement}
        sx={{
          minWidth: '35px',
          color: '#fff',
          fontSize: '20px',
          height: '100%',
          borderRight: '2px solid white',
          borderRadius: 0,
        }}
      >
        -
      </Button>

      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          fontWeight: 600,
          fontSize: '18px',
          width: '40px',
          textAlign: 'center',
        }}
      >
        {count}
      </Typography>

      <Button
        variant="text"
        onClick={handleIncrement}
        sx={{
          minWidth: '35px',
          color: '#fff',
          fontSize: '20px',
          height: '100%',
          borderLeft: '2px solid white',
          borderRadius: 0,
        }}
      >
        +
      </Button>
    </Box>
  );
};

export default AddMoreProducts;
